"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Tables } from "@/types/supabase";

import { useAdminSession } from "@/app/admin/lib/useAdminSession";
import { supabase } from "@/app/lib/supabaseClient";

type SemesterRow = Tables<"semesters">;

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

export default function SemestersAdminPage() {
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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [semesters, setSemesters] = useState<SemesterRow[]>([]);
  const [semesterSavingIds, setSemesterSavingIds] = useState<Set<number>>(
    new Set(),
  );
  const [isCreatingSemester, setIsCreatingSemester] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");

  const setSemesterSaving = (id: number, isSaving: boolean) => {
    setSemesterSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const loadSemesters = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setIsLoadingData(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const semestersResponse = await client
      .from("semesters")
      .select("*")
      .order("created_datetime_utc", { ascending: false });

    if (semestersResponse.error) {
      setErrorMessage(semestersResponse.error.message);
    } else {
      setSemesters(semestersResponse.data ?? []);
    }

    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    if (!canAccessAdmin) {
      setSemesters([]);
      return;
    }

    void loadSemesters();
  }, [canAccessAdmin, loadSemesters]);

  const updateSemester = (id: number, updates: Partial<SemesterRow>) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === id ? { ...semester, ...updates } : semester,
      ),
    );
  };

  const handleSemesterSave = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const semester = semesters.find((item) => item.id === id);
    if (!semester) {
      return;
    }

    setSemesterSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { error } = await client
      .from("semesters")
      .update({ name: semester.name.trim() })
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setStatusMessage("Semester updated.");
    }

    setSemesterSaving(id, false);
  };

  const handleSemesterDelete = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const semester = semesters.find((item) => item.id === id);
    if (!semester) {
      return;
    }

    if (
      !window.confirm(
        `Delete semester "${semester.name}"? Assignments tied to it may fail.`,
      )
    ) {
      return;
    }

    setSemesterSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { error } = await client.from("semesters").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSemesters((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Semester deleted.");
    }

    setSemesterSaving(id, false);
  };

  const handleSemesterCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = supabase;
    if (!client) {
      return;
    }

    const name = newSemesterName.trim();
    if (!name) {
      setErrorMessage("Enter a semester name before saving.");
      return;
    }

    setIsCreatingSemester(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { data, error } = await client
      .from("semesters")
      .insert({ name, created_datetime_utc: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setSemesters((prev) => [data, ...prev]);
      setNewSemesterName("");
      setStatusMessage("Semester created.");
    }

    setIsCreatingSemester(false);
  };

  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Semesters Admin</p>
          <h1>Semesters</h1>
          <p className="lead">
            Manage semesters for assignments and students.
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

        {statusMessage && (
          <div className="admin-alert admin-alert--success" role="status">
            {statusMessage}
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
          <>
            <section className="card admin-section" aria-labelledby="semesters">
              <div className="admin-section__header">
                <div>
                  <h2 id="semesters">Semesters</h2>
                  <p className="admin-section__meta">
                    Update semester names or add new terms.
                  </p>
                </div>
                <div className="admin-section__actions">
                  <span className="admin-badge">{semesters.length} total</span>
                  <button
                    className="admin-button"
                    type="button"
                    onClick={loadSemesters}
                    disabled={isLoadingData}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {isLoadingData ? (
                <p className="admin-empty">Loading semesters...</p>
              ) : semesters.length === 0 ? (
                <p className="admin-empty">No semesters found yet.</p>
              ) : (
                <div className="admin-stack">
                  {semesters.map((semester) => {
                    const isSaving = semesterSavingIds.has(semester.id);

                    return (
                      <div key={semester.id} className="admin-panel">
                        <div className="admin-panel__header">
                          <div>
                            <p className="admin-panel__eyebrow">
                              Semester #{semester.id}
                            </p>
                            <p className="admin-panel__meta">
                              Created {formatTimestamp(semester.created_datetime_utc)}
                            </p>
                          </div>
                          <div className="admin-panel__actions">
                            <button
                              className="admin-button admin-button--primary"
                              type="button"
                              onClick={() => handleSemesterSave(semester.id)}
                              disabled={isSaving}
                            >
                              Save
                            </button>
                            <button
                              className="admin-button admin-button--ghost"
                              type="button"
                              onClick={() => handleSemesterDelete(semester.id)}
                              disabled={isSaving}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="admin-panel__fields">
                          <label className="admin-field admin-field--full">
                            <span className="admin-field__label">Name</span>
                            <input
                              className="admin-input"
                              type="text"
                              value={semester.name}
                              onChange={(event) =>
                                updateSemester(semester.id, {
                                  name: event.target.value,
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <form
                className="admin-panel admin-panel--new"
                onSubmit={handleSemesterCreate}
              >
                <div className="admin-panel__header">
                  <div>
                    <p className="admin-panel__eyebrow">New semester</p>
                    <p className="admin-panel__meta">
                      Add a new term to map future assignments.
                    </p>
                  </div>
                  <div className="admin-panel__actions">
                    <button
                      className="admin-button admin-button--primary"
                      type="submit"
                      disabled={isCreatingSemester}
                    >
                      Create semester
                    </button>
                  </div>
                </div>

                <div className="admin-panel__fields">
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">Semester name</span>
                    <input
                      className="admin-input"
                      type="text"
                      value={newSemesterName}
                      onChange={(event) => setNewSemesterName(event.target.value)}
                    />
                  </label>
                </div>
              </form>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
