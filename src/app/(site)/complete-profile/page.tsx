import {redirect} from "next/navigation";

import type {Tables} from "@/types/supabase";

import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";
import ProfileCompletionForm from "./ProfileCompletionForm";

export const dynamic = "force-dynamic";

export default async function CompleteProfilePage() {
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

  const user = sessionData.session.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single<Pick<Tables<"profiles">, "first_name" | "last_name">>();

  const firstName = profile?.first_name?.trim() ?? "";
  const lastName = profile?.last_name?.trim() ?? "";

  if (firstName && lastName) {
    redirect("/");
  }

  return (
    <main className="page">
      <div className="page__content">
        <section className="card auth-card" aria-labelledby="profile-title">
          <h2
            id="profile-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Finish your profile
          </h2>
          <p className="lead">
            Add your first and last name to continue.
          </p>
          <ProfileCompletionForm
            userId={user.id}
            initialFirstName={profile?.first_name ?? null}
            initialLastName={profile?.last_name ?? null}
          />
        </section>
      </div>
    </main>
  );
}
