"use client";

import {useCallback, useEffect, useState} from "react";

import type {Tables} from "@/types/supabase";

import {useAdminSession} from "@/app/admin/lib/useAdminSession";
import {supabase} from "@/app/lib/supabaseClient";

type SubmissionRow = Tables<"submissions">;
type AssignmentSummary = Pick<Tables<"assignments">, "id" | "title">;
type ProfileSummary = Pick<
  Tables<"profiles">,
  "id" | "email" | "first_name" | "last_name"
>;

type SubmissionRecord = SubmissionRow & {
  assignments?: AssignmentSummary | null;
  profiles?: ProfileSummary | null;
};

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

const getDisplayName = (profile?: ProfileSummary | null) => {
  if (!profile) {
    return "Unknown student";
  }

  const parts = [profile.first_name, profile.last_name].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(" ");
  }

  return profile.email ?? "Unnamed student";
};

const formatContentPreview = (value: string | null) => {
  if (!value) {
    return "No content submitted.";
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "No content submitted.";
  }

  if (normalized.length > 160) {
    return `${normalized.slice(0, 160)}...`;
  }

  return normalized;
};

export default function SubmissionsAdminPage() {
  const {
    session,
    isBooting,
    hasSupabaseConfig,
    isGoogleUser,
    canAccessAdmin,
    authError,
    signInWithGoogle,
    signOut,
  } = useAdminSession();

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  const loadSubmissions = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setIsLoadingData(true);
    setErrorMessage(null);

    const { data, error } = await client
      .from("submissions")
      .select(
        "id, assignment_id, profile_id, content, created_datetime_utc, assignments ( id, title ), profiles ( id, email, first_name, last_name )",
      )
      .order("created_datetime_utc", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSubmissions((data ?? []) as SubmissionRecord[]);
    }

    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    if (!canAccessAdmin) {
      setSubmissions([]);
      return;
    }

    void loadSubmissions();
  }, [canAccessAdmin, loadSubmissions]);

  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Submissions Admin</p>
          <h1>Submissions</h1>
          <p className="lead">
            Review every assignment submission across the course.
          </p>
        </header>

        {!hasSupabaseConfig && (
          <section className="card admin-section">
            <h2>Supabase not configured</h2>
            <p className="admin-section__meta">
              Add `NEXT_PUBLIC_SUPABASE_URL` and
              `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your environment before
              continuing.
            </p>
          </section>
        )}

        {authError && (
          <div className="admin-alert admin-alert--error" role="alert">
            {authError}
          </div>
        )}

        {errorMessage && (
          <div className="admin-alert admin-alert--error" role="alert">
            {errorMessage}
          </div>
        )}

        {hasSupabaseConfig && isBooting && (
          <section className="card admin-section">
            <h2>Checking session</h2>
            <p className="admin-section__meta">
              Confirming your admin credentials...
            </p>
          </section>
        )}

        {hasSupabaseConfig && !isBooting && !session && (
          <section className="card admin-section">
            <h2>Admin login</h2>
            <p className="admin-section__meta">
              Sign in with Google to access the admin console.
            </p>
            <div className="admin-panel__actions">
              <button
                className="admin-button admin-button--primary"
                type="button"
                onClick={signInWithGoogle}
              >
                Login with Google
              </button>
            </div>
          </section>
        )}

        {hasSupabaseConfig && !isBooting && session && !isGoogleUser && (
          <section className="card admin-section">
            <h2>Google account required</h2>
            <p className="admin-section__meta">
              This admin area only supports Google sign-in. Sign out and use a
              Google account to continue.
            </p>
            <div className="admin-panel__actions">
              <button className="admin-button" type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          </section>
        )}

        {hasSupabaseConfig && !isBooting && canAccessAdmin && (
          <section className="card admin-section" aria-labelledby="submissions">
            <div className="admin-section__header">
              <div>
                <h2 id="submissions">Submissions</h2>
                <p className="admin-section__meta">
                  Browse every submission, ordered by the most recent.
                </p>
              </div>
              <div className="admin-section__actions">
                <span className="admin-badge">
                  {submissions.length} total
                </span>
                <button
                  className="admin-button"
                  type="button"
                  onClick={() => void loadSubmissions()}
                  disabled={isLoadingData}
                >
                  Refresh
                </button>
              </div>
            </div>

            {isLoadingData ? (
              <p className="admin-empty">Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <p className="admin-empty">No submissions found yet.</p>
            ) : (
              <div className="admin-table__scroll">
                <table className="admin-table">
                  <caption className="sr-only">
                    Assignment submissions table
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Submitted</th>
                      <th scope="col">Assignment</th>
                      <th scope="col">Student</th>
                      <th scope="col">Email</th>
                      <th scope="col">Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => {
                      const assignmentTitle =
                        submission.assignments?.title ??
                        `Assignment #${submission.assignment_id}`;
                      const assignmentId =
                        submission.assignments?.id ?? submission.assignment_id;
                      const studentName = getDisplayName(submission.profiles);
                      const studentEmail =
                        submission.profiles?.email ?? "Unknown email";
                      const profileId =
                        submission.profiles?.id ?? submission.profile_id;
                      const contentPreview = formatContentPreview(
                        submission.content,
                      );

                      return (
                        <tr key={submission.id}>
                          <td>
                            {formatTimestamp(
                              submission.created_datetime_utc,
                            )}
                            <span className="admin-table__meta">
                              Submission ID {submission.id}
                            </span>
                          </td>
                          <td>
                            {assignmentTitle}
                            <span className="admin-table__meta">
                              Assignment ID {assignmentId}
                            </span>
                          </td>
                          <td>
                            {studentName}
                            <span className="admin-table__meta">
                              Profile ID {profileId}
                            </span>
                          </td>
                          <td className="admin-table__cell--muted">
                            {studentEmail}
                          </td>
                          <td>
                            <span
                              className="admin-table__content"
                              title={contentPreview}
                            >
                              {contentPreview}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
