import type {Metadata} from "next";
import Link from "next/link";
import {redirect} from "next/navigation";

import AdminThemeToggle from "@/app/admin/components/AdminThemeToggle";
import AdminUiScope from "@/app/admin/components/AdminUiScope";
import AdminHeaderSignOut from "@/app/admin/components/AdminHeaderSignOut";
import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";
import type {Tables} from "@/types/supabase";

export const metadata: Metadata = {
  title: "Admin Console | The Humor Project",
  description:
    "Admin tools for assignments, submissions, agendas, documentation, semesters, and users.",
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
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_superadmin")
    .eq("id", sessionData.session.user.id)
    .single<Pick<Tables<"profiles">, "is_superadmin">>();

  if (profileError || !profile?.is_superadmin) {
    redirect("/access-denied");
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
            <Link className="admin-nav__link" href="/admin/submissions">
              Submissions
            </Link>
            <Link className="admin-nav__link" href="/admin/agendas">
              Agendas
            </Link>
            <Link className="admin-nav__link" href="/admin/documentations">
              Documentation
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
