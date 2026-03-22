
"use client";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import React from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TrTranslationSchema = z.object({
    title: z.string().min(1, "Required"),
    slug: z.string().min(1, "Required"),
    excerpt: z.string().optional(),
    content: z.string().optional(),
});

const EnTranslationSchema = z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
});


const CreatePostSchema = z.object({
    cover_url: z.string().url().optional().or(z.literal("")),
    category: z.string().min(1, "Required"),
    published: z.boolean(),
    reading_time: z.number().optional(),
    translations: z.object({
        tr: TrTranslationSchema,
        en: EnTranslationSchema.optional()
    }),
});

type CreatePostForm = z.infer<typeof CreatePostSchema>;


const AdminPostPage = () => {
    const router = useRouter();
    const [activeLocale, setActiveLocale] = useState<"tr" | "en">("tr");
    const form = useForm<CreatePostForm>({
        resolver: zodResolver(CreatePostSchema),
        defaultValues: {
            cover_url: "",
            category: "",
            published: false,
            reading_time: undefined,
            translations: {
                tr: { title: "", slug: "", excerpt: "", content: "" },
                en: { title: "", slug: "", excerpt: "", content: "" },
            },
        },
    });

    const { register, handleSubmit, watch, setValue } = form;
    const tr = watch("translations.tr");
    const en = watch("translations.en");


    function generateSlug(locale: "tr" | "en") {
        const title = watch(`translations.${locale}.title`);
        const slug = title
            ?.toLowerCase()
            .trim()
            .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        setValue(`translations.${locale}.slug`, slug || "");


    }

    async function onSubmit(data: CreatePostForm) {

        console.log(data)
        const res = await fetch("/api/admin/posts", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (res.ok) router.push("/admin/posts");
        else alert("Error creating post");
    }

    const current = activeLocale === "tr" ? tr : en;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="cover_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Url</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Programming, Linux..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-6 items-center">
                        <FormField
                            control={form.control}
                            name="reading_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reading Time (min)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === "" ? undefined : Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="published"
                            render={({ field }) => (
                                <FormItem className="mt-7 flex items-center gap-2">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                    <FormLabel>Published</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                    <section className="space-y-4 border p-4 rounded-lg">
                        <div className='flex gap-4 mb-4'>
                            <Button
                                type="button"

                                className={activeLocale === "tr"
                                    ? "underline font-semibold"
                                    : ""
                                }

                                onClick={() => setActiveLocale("tr")}
                            >
                                TR

                            </Button>

                            <Button
                                type="button"
                                className={activeLocale === "en"
                                    ? "underline font-semibold"
                                    : ""
                                }

                                onClick={() => setActiveLocale("en")}
                            >
                                EN

                            </Button>

                        </div>

                        <div className={activeLocale === "tr" ? "space-y-4" : "hidden"}>
                            <FormField
                                control={form.control}
                                name={`translations.tr.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title ({activeLocale})</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Post title..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.tr.slug`}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Slug ({activeLocale})</FormLabel>
                                            <button
                                                type="button"
                                                onClick={()=>generateSlug("tr")}
                                                className="text-xs underline text-gray-600"
                                            >
                                                Generate from title
                                            </button>
                                        </div>

                                        <FormControl>
                                            <Input placeholder="post-title-slug" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.tr.excerpt`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt ({activeLocale})</FormLabel>
                                        <FormControl>
                                            <textarea className="h-20 border" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.tr.content`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content ({activeLocale})</FormLabel>
                                        <FormControl>
                                            <textarea className="h-40 border" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                         <div className={activeLocale === "en" ? "space-y-4" : "hidden"}>
                            <FormField
                                control={form.control}
                                name={`translations.en.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title ({activeLocale})</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Post title..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.en.slug`}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Slug ({activeLocale})</FormLabel>
                                            <button
                                                type="button"
                                                onClick={()=>generateSlug("en")}
                                                className="text-xs underline text-gray-600"
                                            >
                                                Generate from title
                                            </button>
                                        </div>

                                        <FormControl>
                                            <Input placeholder="post-title-slug" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.en.excerpt`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt ({activeLocale})</FormLabel>
                                        <FormControl>
                                            <textarea className="h-20 border" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.en.content`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content ({activeLocale})</FormLabel>
                                        <FormControl>
                                            <textarea className="h-40 border" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>


                    </section>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/posts")}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">Create Post</Button>
                    </div>

                </form>

            </Form>

        </div>
    )
}

export default AdminPostPage