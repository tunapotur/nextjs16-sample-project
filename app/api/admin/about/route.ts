import { z } from "zod";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCurrentAdmin } from "@/lib/admin-auth";


const AboutSchema = z.object({
  locale: z.string(),
  hero_title: z.string().min(2),
  hero_subtitle: z.string().optional().nullable(),
  hero_caption: z.string().optional().nullable(),
  hero_paragraph1: z.string().optional().nullable(),
  hero_paragraph2: z.string().optional().nullable(),
  hero_paragraph3: z.string().optional().nullable(),
  hero_cta_label: z.string().optional().nullable(),
  hero_cta_url: z.string().optional().nullable(),
});

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    const {data , error} = await supabaseAdmin
        .from("about_page")
        .select("*")
        .eq("locale", locale)
        .maybeSingle();

    if(error){
         return NextResponse.json(null);
    }

    return NextResponse.json(data || null);    
}

export async function PUT(req:Request) {
    const admin = await getCurrentAdmin();
    if(!admin){
         return NextResponse.json({error : "Unauthorized"}, {status:401});
    }
    const body = await req.json();
    const parsed = AboutSchema.safeParse(body);

    if(!parsed.success){
       return NextResponse.json({error : "Invalid Data "}, {status:400});

    }

    const data = parsed.data;

    const {data:existing, error : selectError} = await supabaseAdmin
        .from("about_page")
        .select("id")
        .eq("locale",data.locale)
        .maybeSingle();
    
    if(selectError){
        return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    const payload = {
        hero_title: data.hero_title,
        hero_subtitle: data.hero_subtitle,
        hero_caption: data.hero_caption,
        hero_paragraph1: data.hero_paragraph1,
        hero_paragraph2: data.hero_paragraph2,
        hero_paragraph3: data.hero_paragraph3,
        hero_cta_label: data.hero_cta_label,
        hero_cta_url: data.hero_cta_url,
        updated_at: new Date().toISOString(),
        locale: data.locale,
    }

    if(existing){
        await supabaseAdmin
            .from("about_page")
            .update(payload)
            .eq("id", existing.id)
    }else{
        await supabaseAdmin.from("about_page").insert(payload)
    }

     return NextResponse.json({ success: true });
}
