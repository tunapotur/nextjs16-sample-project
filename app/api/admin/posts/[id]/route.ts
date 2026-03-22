import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCurrentAdmin } from "@/lib/admin-auth";


export async function GET(req:Request, context: {params: Promise<{id:string}>}) {

    const {id} = await context.params


    const {data, error} = await supabaseAdmin
        .from("posts")
        .select(
            `
            id,
            cover_url,
            category,
            published,
            reading_time,
            post_translations(locale, title, slug, excerpt, content)
            `)
        .eq("id", id)
        .single();

    if(error || !data){
          return NextResponse.json({ error: "Post not found" }, { status: 404 }); 
    }

    const tr = data.post_translations.find((t)=>t.locale === "tr") || {};
    const en = data.post_translations.find((t)=>t.locale === "en") || {};

    return NextResponse.json({
        id,
        cover_url: data.cover_url,
        category: data.category,
        published: data.published,
        reading_time: data.reading_time,
        translations:{
            tr,
            en
        }
    })

}

export async function PUT(req:Request, context: {params: Promise<{id:string}>}) {

  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await req.json();

  const { cover_url, category, published, reading_time, translations } = body;

  const {error :postError} = await supabaseAdmin
    .from("posts")
    .update({
      cover_url: cover_url || null,
      category,
      published,
      reading_time: reading_time || null,
    })
    .eq("id",id)

    if(postError){
        return NextResponse.json({error: "Post update failed"}, {status:500})
    }

    await supabaseAdmin.from("post_translations").delete().eq("post_id",id)

    const translationsArray = Object.entries(translations)
    .filter(([locale, t]: any) => {
      if (locale === "tr") return true;
      return t.title || t.slug || t.excerpt || t.content;
    })
    .map(([locale, t]: any) => ({
      post_id: id,
      locale,
      title: t.title || "",
      slug: t.slug || "",
      excerpt: t.excerpt || "",
      content: t.content || "",
    }));

    const {error: transError} = await supabaseAdmin
        .from("post_translations")
        .insert(translationsArray)

    if (transError) {
    console.log(transError);
    return NextResponse.json({ error: "Translation update failed" }, { status: 500 });
    }

      return NextResponse.json({ success: true, id });


}
export async function DELETE(req:Request, context: {params: Promise<{id:string}>}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing post id" },
      { status: 400 }
    );
  }

  const { error: transError } = await supabaseAdmin
    .from("post_translations")
    .delete()
    .eq("post_id", id);
  
  if (transError) {
    return NextResponse.json(
      { error: "Failed to delete translations", details: transError },
      { status: 500 }
    );
  }

  const { error: postError } = await supabaseAdmin
    .from("posts")
    .delete()
    .eq("id", id);

  if (postError) {
    return NextResponse.json(
      { error: "Failed to delete post", details: postError },
      { status: 500 }
    );
  }

    return NextResponse.json({ success: true });




}
