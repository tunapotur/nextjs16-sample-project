import { Locale } from '@/i18n';
import Image from 'next/image';
import React from 'react'


export interface BlogGridPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    coverUrl: string | null;
    dateLabel: string;
    readingTimeLabel: string;
    slug: string;
}

interface BlogGridProps {
    posts: BlogGridPost[];
    locale: Locale;
}

const BlogGrid = ({ posts, locale }: BlogGridProps) => {
    return (
        <section className='text-mycolor2 py-16'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='mb-8 flex items-center justify-between gap-4'>
                    <h2>
                        Latest Post
                    </h2>
                    <p className='text-sm text-mycolor2/70'>
                        Lorem ipsum dolor sit amet.
                    </p>

                </div>

                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {posts.map((post) => (
                        <article key={post.id}
                            className=' flex h-full flex-col mb-4 
                            overflow-hidden rounded-3xl border bg-mycolor1/60
                            border-mycolor2/10'>

                            <div className='relative h-56 w-full'>
                                <Image
                                    src={post.coverUrl || "/bg.jpg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                                />

                            </div>
                            <div className='flex flex-1 flex-col gap-4 px-5 pt-4'>
                                <span className="inline-flex w-fit items-center 
                                rounded-full bg-mycolor2 px-3 py-1 text-sm
                                font-semibold uppercase tracking-wide text-mycolor1">
                                    {post.category || (locale === "tr" ? "Genel" : "General")}
                                </span>
                                <h3 className="text-lg font-semibold leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-mycolor2/70 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto mb-2 flex items-center justify-between pt-2 
                                text-[11px] font-medium text-mycolor2/60">
                                    <span>{post.dateLabel}</span>
                                    <span>{post.readingTimeLabel}</span>

                                </div>

                            </div>
                        </article>
                    ))}

                </div>

            </div>


        </section>
    )
}

export default BlogGrid