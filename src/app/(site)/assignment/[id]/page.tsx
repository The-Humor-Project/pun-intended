import Link from "next/link";
import {notFound, redirect} from "next/navigation";

import type {Tables} from "@/types/supabase";

import {decodeHtmlEntities} from "@/app/lib/decodeHtmlEntities";
import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

export const dynamic = "force-dynamic";

type AssignmentRow = Tables<"assignments">;

type AssignmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatDueDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { id } = await params;

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

  const assignmentId = Number(id);

  if (!Number.isFinite(assignmentId)) {
    notFound();
  }

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", assignmentId)
    .limit(1);

  if (error) {
    return (
      <main className="page assignment-week">
        <div className="page__content">
          <section className="card assignments-detail">
            <h2 className="section-title">Assignments</h2>
            <p className="week__empty">{error.message}</p>
            <Link className="assignments-list__meta-label" href="/assignments">
              Back to assignments
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const assignment = (data?.[0] ?? null) as AssignmentRow | null;

  if (!assignment) {
    return (
      <main className="page assignment-week">
        <div className="page__content">
          <section className="card assignments-detail">
            <h2 className="section-title">Assignments</h2>
            <p className="week__empty">Assignment not found.</p>
            <Link className="assignments-list__meta-label" href="/assignments">
              Back to assignments
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page assignment-week">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            {assignment.title}
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignment</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    {formatDueDate(assignment.due_date_utc)}
                  </span>
                </div>
              </div>
              {assignment.description ? (
                <div
                  className="assignment-body"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtmlEntities(assignment.description),
                  }}
                />
              ) : (
                <p className="week__empty">No description yet.</p>
              )}
            </div>
            <Link className="assignments-list__meta-label" href="/assignments">
              Back to assignments
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
