import {redirect} from "next/navigation";

import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
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
    <main className="page">
      <div className="page__content">
        <section className="card" aria-labelledby="submissions-title">
          <h2
            id="submissions-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Submissions
          </h2>
          <p className="lead">
            This is where you'll submit your project homework. More details
            coming soon!
          </p>
        </section>
      </div>
    </main>
  );
}
