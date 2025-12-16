"use client";
import { Locale } from "@/i18n";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Dict = Awaited<
  ReturnType<typeof import("@/lib/dictionaries").getDictionary>
>;

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
    { label: dict.nav.about, href: "about" },
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

  return <div>Side Header</div>;
};

export default SiteHeader;
