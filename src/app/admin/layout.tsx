import type {Metadata} from "next";
import {redirect} from "next/navigation";

import AdminThemeToggle from "@/app/admin/components/AdminThemeToggle";
import AdminUiScope from "@/app/admin/components/AdminUiScope";
import AdminHeaderSignOut from "@/app/admin/components/AdminHeaderSignOut";
import AdminSidebarNav from "@/app/admin/components/AdminSidebarNav";
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
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <p className="admin-sidebar__eyebrow">Admin Console</p>
            <p className="admin-sidebar__title">The Humor Project</p>
          </div>
          <AdminSidebarNav />
          <div className="admin-sidebar__footer">
            <AdminThemeToggle />
            <AdminHeaderSignOut />
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
