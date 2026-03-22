import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCurrentAdmin } from "@/lib/admin-auth";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    const { data, error } = await supabaseAdmin
        .from("posts")
        .select(
            `
            id,
            cover_url,
            category,
            published,
            reading_time,
            created_at,
            post_translations(
                locale,
                title,
                slug,
                excerpt
            )
            `
        )
        .order("created_at", {ascending:false})

      if (error) return NextResponse.json([], { status: 500 });


      const mapped =
        (data?? [])
            .map((p)=>{
                const t = p.post_translations.find((x)=>x.locale === locale);
                return{
                    id: p.id,
                    cover_url: p.cover_url,
                    category: p.category,
                    published: p.published,
                    reading_time: p.reading_time,
                    created_at: p.created_at,
                    title: t?.title,
                    slug: t?.slug,
                    excerpt: t?.excerpt,

                }
            })
            .filter((p)=>p.title)


  return NextResponse.json(mapped);

}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

   const {
    cover_url,
    category,
    published,
    reading_time,
    translations, 
  } = body;

  if (!category || !translations || typeof translations !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: postData, error: postError } = await supabaseAdmin
    .from("posts")
    .insert([
        {
            cover_url:cover_url || null,
            category,
            published,
            reading_time: reading_time || null
        }
    ])
        .select("id")
        .single();

    if(postError || !postData.id){
        console.log(postError)
         return NextResponse.json(
            { error: "Post insert failed", details: postError },
            { status: 500 }
        );
    }

      const postId = postData.id;

      const translationsArray = Object.entries(translations)
        .filter(([locale, t]:any)=>{
            if(locale ==="tr") return true;

            return (t.title || t.slug || t.excerpt || t.content)
        })
      
      .map(
        ([locale, t]: any)=>({
            post_id:postId,
            locale,
            title: t.title || "",
            slug : t.slug || "",
            excerpt: t.excerpt || "",
            content : t.content || ""
        })
      )

      const {error: transError} = await supabaseAdmin
        .from("post_translations")
        .insert(translationsArray)

     if(transError){
                console.log(transError)

           return NextResponse.json(
            { error: "Translation insert failed", details: transError },
            { status: 500 }
            );
     }


       return NextResponse.json({ success: true, id: postId });


}
