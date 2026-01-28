import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import type {Tables} from "@/types/supabase";

import {resolveTimeZone} from "@/app/lib/resolveTimeZone";
import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";
import SubmissionsClient from "./SubmissionsClient";

export const dynamic = "force-dynamic";

type AssignmentSummary = Pick<Tables<"assignments">, "id" | "title" | "due_date_utc">;
type SubmissionSummary = Pick<
  Tables<"submissions">,
  "id" | "assignment_id" | "content" | "created_datetime_utc"
>;

export default async function SubmissionsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const timeZone = resolveTimeZone(cookieStore.get("timezone")?.value);

  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    redirect("/login");
  }

  const userId = sessionData.session.user.id;
  const [assignmentsResponse, submissionsResponse] = await Promise.all([
    supabase
      .from("assignments")
      .select("id, title, due_date_utc")
      .order("due_date_utc", { ascending: true }),
    supabase
      .from("submissions")
      .select("id, assignment_id, content, created_datetime_utc")
      .eq("profile_id", userId)
      .order("created_datetime_utc", { ascending: false }),
  ]);

  if (assignmentsResponse.error || submissionsResponse.error) {
    const message =
      assignmentsResponse.error?.message ??
      submissionsResponse.error?.message ??
      "Unable to load submissions.";
    return (
      <main className="page">
        <div className="page__content">
          <section className="card" aria-labelledby="submissions-title">
            <h2 id="submissions-title" className="section-title">
              Submissions
            </h2>
            <p className="week__empty">{message}</p>
          </section>
        </div>
      </main>
    );
  }

  const assignments = (assignmentsResponse.data ?? []) as AssignmentSummary[];
  const submissions = (submissionsResponse.data ?? []) as SubmissionSummary[];

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
            Submit your homework!
          </p>
          <SubmissionsClient
            assignments={assignments}
            submissions={submissions}
            timeZone={timeZone}
            userId={userId}
          />
        </section>
      </div>
    </main>
  );
}
