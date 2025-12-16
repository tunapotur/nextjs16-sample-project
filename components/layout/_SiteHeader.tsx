"use client"
import { Locale } from '@/i18n'
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { ModeToggle } from './ModeToggle';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dict } from '@/constans/types';
import MobileMenu from './MobileMenu';

interface SiteHeaderProps {
    locale: Locale;
    dict: Dict;
}

const SiteHeader = ({ dict, locale }: SiteHeaderProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: dict.nav.home, href: "" },
        { label: dict.nav.videos, href: "videos" },
        { label: dict.nav.archive, href: "archive" },
        { label: dict.nav.tags, href: "tags" },
        { label: dict.nav.about, href: "about" }
    ];

    const buildHref = (path: string) => `/${locale}${path ? `/${path}` : ""}`;

    const isActive = (itemHref: string) => {
        const full = buildHref(itemHref);
        if (!pathname) return false;
        if (full === `/${locale}`) return pathname === full;
        return pathname.startsWith(full);
    };

    const switchLocalePath = (targetLocale: Locale) => {
        if (!pathname) return `/${targetLocale}`;
        const segments = pathname.split("/");
        if (segments.length > 1) segments[1] = targetLocale;
        return segments.join("/") || `/${targetLocale}`;
    };

    const handleLocaleChange = (value: string) => {
        const target = value as Locale;
        router.push(switchLocalePath(target));
    };




    return (
        <header className='border-b bg-mycolor1 text-mycolor2'>
            <div className='mx-auto flex items-center justify-between px-4 lg:px-8 py-6'>
                <div>
                    <Link href={buildHref("")}
                        className='text-2xl font-semibold '>
                        Logo
                    </Link>
                </div>

                <nav className='lg:flex hidden items-center gap-2 text-sm'>
                    {navItems.map((item, idx) => {
                        const href = buildHref(item.href);
                        const active = isActive(item.href)

                        return (
                            <Link
                                href={href}
                                key={item.href || idx}
                                className={["rounded-xl px-3 py-1.5 font-medium transition-colors",
                                    active
                                        ? "bg-mycolor2 text-mycolor1"
                                        : "text-mycolor2 "

                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        )
                    })}


                </nav>


                <div className='flex items-center gap-4'>
                    <ModeToggle />

                    <Select defaultValue={locale} onValueChange={handleLocaleChange}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="tr">TR</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div className='flex lg:hidden'>
                       <MobileMenu dict={dict} locale={locale}/>
                    </div>
                </div>

            </div>


        </header>
    )
}

export default SiteHeader