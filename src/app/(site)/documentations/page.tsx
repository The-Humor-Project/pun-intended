import type {CSSProperties} from "react";
import Link from "next/link";
import {redirect} from "next/navigation";

import type {Tables} from "@/types/supabase";

import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

export const dynamic = "force-dynamic";

type DocumentationSummary = Pick<
  Tables<"documentations">,
  "id" | "title" | "created_datetime_utc" | "modified_datetime_utc"
>;

const revealDelay = (index: number): CSSProperties => ({
  animationDelay: `${80 + index * 60}ms`,
});

const formatTimestamp = (value: string | null) => {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default async function DocumentationsPage() {
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

  const { data, error } = await supabase
    .from("documentations")
    .select("id, title, created_datetime_utc, modified_datetime_utc")
    .order("created_datetime_utc", { ascending: false });

  if (error) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card documentations" aria-labelledby="documentation-title">
            <h2 id="documentation-title" className="section-title">
              Documentation
            </h2>
            <p className="week__empty">{error.message}</p>
          </section>
        </div>
      </main>
    );
  }

  const documentations = (data ?? []) as DocumentationSummary[];

  return (
    <main className="page">
      <div className="page__content">
        <section className="card documentations" aria-labelledby="documentation-title">
          <h2
            id="documentation-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Documentation
          </h2>
          <p className="lead">
            Reference guides and documentation for the course.
          </p>
          {documentations.length === 0 ? (
            <p className="week__empty">No documentation yet.</p>
          ) : (
            <ul className="assignments-list">
              {documentations.map((documentation, index) => {
                const title = documentation.title.trim() || "Untitled documentation";
                const updatedAt =
                  documentation.modified_datetime_utc ??
                  documentation.created_datetime_utc;

                return (
                  <li
                    key={documentation.id}
                    className="assignments-list__item reveal"
                    style={revealDelay(index)}
                  >
                    <div className="assignments-list__card">
                      <div className="assignments-list__header">
                        <span className="assignments-list__title">{title}</span>
                        <Link
                          className="assignments-list__button"
                          href={`/documentation/${documentation.id}`}
                        >
                          Read doc
                        </Link>
                      </div>
                      <div className="assignments-list__meta">
                        <span className="assignments-list__meta-label">
                          Last updated
                        </span>
                        <span className="assignments-list__meta-value">
                          {formatTimestamp(updatedAt)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
