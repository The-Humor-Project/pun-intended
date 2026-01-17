import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminThemeToggle from "@/app/admin/components/AdminThemeToggle";
import AdminUiScope from "@/app/admin/components/AdminUiScope";
import AdminHeaderSignOut from "@/app/admin/components/AdminHeaderSignOut";
import { createSupabaseServerClient } from "@/app/lib/supabaseServerClient";

export const metadata: Metadata = {
  title: "Admin Console | The Humor Project",
  description: "Admin tools for assignments, semesters, agendas, and users.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    redirect("/login");
  }

  return (
    <div className="admin-shell">
      <AdminUiScope />
      <header className="admin-topbar">
        <div>
          <p className="admin-topbar__eyebrow">Admin Console</p>
          <p className="admin-topbar__title">The Humor Project</p>
        </div>
        <div className="admin-topbar__actions">
          <nav className="admin-nav" aria-label="Admin">
            <Link className="admin-nav__link" href="/admin/assignments">
              Assignments
            </Link>
            <Link className="admin-nav__link" href="/admin/agendas">
              Agendas
            </Link>
            <Link className="admin-nav__link" href="/admin/semesters">
              Semesters
            </Link>
            <Link className="admin-nav__link" href="/admin/users">
              Users
            </Link>
          </nav>
          <AdminThemeToggle />
          <AdminHeaderSignOut />
        </div>
      </header>
      <div className="admin-main">{children}</div>
    </div>
  );
}
