import type {CSSProperties} from "react";
import Link from "next/link";

import {supabaseServer} from "@/app/lib/supabaseServer";

export const dynamic = "force-dynamic";

type AssignmentSummary = {
  id: number;
  title: string;
  due_date_utc: string;
};

const revealDelay = (index: number): CSSProperties => ({
  animationDelay: `${80 + index * 60}ms`,
});

const formatDueDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  return `${weekday}, ${date.toLocaleString()}`;
};

export default async function AssignmentsPage() {
  if (!supabaseServer) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card assignments" aria-labelledby="assignments-title">
            <h2 id="assignments-title" className="section-title">
              Assignments
            </h2>
            <p className="week__empty">Assignments are not available yet.</p>
          </section>
        </div>
      </main>
    );
  }

  const { data, error } = await supabaseServer
    .from("assignments")
    .select("id, title, due_date_utc")
    .order("due_date_utc", { ascending: true });

  if (error) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card assignments" aria-labelledby="assignments-title">
            <h2 id="assignments-title" className="section-title">
              Assignments
            </h2>
            <p className="week__empty">{error.message}</p>
          </section>
        </div>
      </main>
    );
  }

  const assignments = (data ?? []) as AssignmentSummary[];

  return (
    <main className="page">
      <div className="page__content">
        <section className="card assignments" aria-labelledby="assignments-title">
          <h2
            id="assignments-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Assignments
          </h2>
          {assignments.length === 0 ? (
            <p className="week__empty">No assignments yet.</p>
          ) : (
            <ul className="assignments-list">
              {assignments.map((assignment, index) => (
                <li
                  key={assignment.id}
                  className="assignments-list__item reveal"
                  style={revealDelay(index)}
                >
                  <div className="assignments-list__card">
                    <div className="assignments-list__header">
                      <span className="assignments-list__title">
                        {assignment.title}
                      </span>
                      <Link
                        className="assignments-list__button"
                        href={`/assignment/${assignment.id}`}
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="assignments-list__meta">
                      <span className="assignments-list__meta-label">
                        Due date
                      </span>
                      <span className="assignments-list__meta-value">
                        {formatDueDate(assignment.due_date_utc)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
