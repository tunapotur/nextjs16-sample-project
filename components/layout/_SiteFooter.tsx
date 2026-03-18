"use client"

import { Dict } from '@/constans/types';
import { Locale } from '@/i18n';
import { Facebook, Github, LucideIcon, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface SiteFooterProps {
    locale: Locale;
    dict: Dict;
    recentPosts: {
        id: string;
        title: string;
        slug: string;
        dateLabel: string;
        coverUrl?: string | null;
    }[];
}

const socialIcons: { icon: LucideIcon; href: string; label: string }[] = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Rss, href: "#", label: "RSS" },
];

const SiteFooter = ({ dict, locale, recentPosts }: SiteFooterProps) => {
    const pathname = usePathname();
    const buildHref = (path: string) => `/${locale}${path ? `/${path}` : ""}`;

    const menuLinks = [
        { label: dict.nav.home, href: "" },
        { label: dict.nav.videos, href: "videos" },
        { label: dict.nav.archive, href: "archive" },
    ];

    const pagesLinks = [
        { label: dict.footer.pages.about, href: "about" },
        { label: dict.footer.pages.contact, href: "contact" },
        { label: dict.footer.pages.elements, href: "elements" },
    ];

    const year = new Date().getFullYear();


    return (
        <footer className='mt-16 border-t border-mycolor2/10 bg-mycolor1 text-mycolor2'>
            <div className=' mx-auto max-w-7xl px-4 py-12 lg:py-16'>
                <div className='grid gap-10 md:grid-cols-8'>
                    <div className='space-y-4 md:col-span-2'>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {dict.site.title}
                        </h2>
                        <p className="max-w-md text-sm leading-relaxed text-mycolor2/70">
                            {dict.site.description}
                        </p>
                        <div className='mt-4 flex flex-wrap items-center gap-3 text-mycolor2'>
                            {socialIcons.map((item) => (
                                <Link key={item.label} href={item.href}>
                                    <item.icon className='h-4 w-4' />

                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className='space-y-4 md:col-span-4' >
                        <div className='grid gap-4 sm:grid-cols-3'>
                            {recentPosts.map((post) => (
                                <article key={post.id}
                                    className=' flex  flex-col mb-4 
                            overflow-hidden rounded-3xl border bg-mycolor1/60
                            border-mycolor2/10'>

                                    <div className='relative h-20 w-full'>
                                        <Image
                                            src={post.coverUrl || "/bg.jpg"}
                                            alt={post.title}
                                            fill
                                            className="object-cover w-auto h-16"
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

                    <div className='space-y-4'>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-mycolor2/80">
                            {dict.footer.pagesTitle}
                        </h3>
                        <ul className='space-y-2 text-sm'>
                            {pagesLinks.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={buildHref(item.href)}>
                                        {item.label}
                                    </Link>

                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='space-y-4'>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-mycolor2/80">
                            {dict.footer.pagesTitle}
                        </h3>
                        <ul className='space-y-2 text-sm'>
                            {pagesLinks.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={buildHref(item.href)}>
                                        {item.label}
                                    </Link>

                                </li>
                            ))}
                        </ul>
                    </div>



                </div>
                <div className=' mt-10 border-t border-mycolor2/10'></div>

                <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-mycolor2/60 md:flex-row">
                    <p>
                        {year} © <span className="font-semibold">{dict.site.title}</span>.{" "}
                        {dict.footer.copyrightPrefix}
                    </p>
                    <p>
                        {dict.footer.publishedWith}{" "}
                        <span className="font-semibold">Next.js&nbsp;16</span>.
                    </p>
                </div>


            </div>


        </footer>
    )
}

export default SiteFooter