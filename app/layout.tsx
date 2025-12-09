import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Success",
  description: "Register all your successes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
