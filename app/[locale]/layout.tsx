import { i18n, Locale } from "@/i18n";
import { getDictionary } from "@/lib/dictionaries";
import React from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SideFooter from "@/components/layout/SiteFooter";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

const LocaleLayout = async ({ children, params }: LayoutProps) => {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <SiteHeader dict={dict} locale={locale} />
      {children}
      <SideFooter />
    </div>
  );
};

export default LocaleLayout;
