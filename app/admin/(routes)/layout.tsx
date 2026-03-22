import LogoutButton from "@/components/admin/LogoutButton";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface RoutesLayoutAdminProps {
  children: React.ReactNode;
}

const RoutesLayoutAdmin = async ({ children }: RoutesLayoutAdminProps) => {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-3 px-6 flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="font-semibold text-2xl">
            Admin Panel
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/about">About</Link>
          <Link href="/admin/posts">Posts</Link>
        </nav>

        <div>
          <LogoutButton />
        </div>
      </header>

      <main className="p-10">{children}</main>
    </div>
  );
};

export default RoutesLayoutAdmin;
