import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const locale = i18n.defaultLocale;

    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }
  return NextResponse.next();
}

/* Bu kod, Next.js middleware’in:
  Statik dosyalarda
  _next internal route’larında çalışmasını engeller,
  sadece gerçek kullanıcı isteklerinde devreye sokar.

  ÖRNEK OLARAK;
  ✅ Middleware ÇALIŞIR
  /
  /login
  /dashboard
  /api/user
  /profile/settings

  ❌ Middleware ÇALIŞMAZ
  /_next/static/...
  /_next/image/...
  /favicon.ico
  /logo.png
  /styles.css
  /robots.txt
*/
export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
