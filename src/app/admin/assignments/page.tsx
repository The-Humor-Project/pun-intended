"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import type { Tables } from "@/types/supabase";

import RichTextEditor from "@/app/admin/components/RichTextEditor";
import { useAdminSession } from "@/app/admin/lib/useAdminSession";
import { supabase } from "@/app/lib/supabaseClient";

type AssignmentRow = Tables<"assignments">;
type SemesterRow = Tables<"semesters">;

type AssignmentDraft = {
  title: string;
  description: string;
  dueDateLocal: string;
  semesterId: string;
};

const emptyAssignmentDraft: AssignmentDraft = {
  title: "",
  description: "",
  dueDateLocal: "",
  semesterId: "",
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

const toDatetimeLocal = (value: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toUtcIso = (value: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

const hasRichTextContent = (value: string) => stripHtml(value).length > 0;

export default function AssignmentsAdminPage() {
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

  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [semesters, setSemesters] = useState<SemesterRow[]>([]);

  const [assignmentSavingIds, setAssignmentSavingIds] = useState<Set<number>>(
    new Set(),
  );
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  const [newAssignment, setNewAssignment] = useState<AssignmentDraft>(
    emptyAssignmentDraft,
  );

  const semesterNameById = useMemo(() => {
    const map = new Map<number, string>();
    semesters.forEach((semester) => {
      map.set(semester.id, semester.name);
    });
    return map;
  }, [semesters]);

  const sortedAssignments = useMemo(() => {
    const copy = [...assignments];
    copy.sort((a, b) => {
      const aTime = new Date(a.due_date_utc).getTime();
      const bTime = new Date(b.due_date_utc).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return a.due_date_utc.localeCompare(b.due_date_utc);
      }
      return aTime - bTime;
    });
    return copy;
  }, [assignments]);

  const setAssignmentSaving = (id: number, isSaving: boolean) => {
    setAssignmentSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const loadData = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setIsLoadingData(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const [assignmentsResponse, semestersResponse] = await Promise.all([
      client
        .from("assignments")
        .select("*")
        .order("due_date_utc", { ascending: true }),
      client
        .from("semesters")
        .select("*")
        .order("created_datetime_utc", { ascending: false }),
    ]);

    if (assignmentsResponse.error) {
      setErrorMessage(assignmentsResponse.error.message);
    } else {
      setAssignments(assignmentsResponse.data ?? []);
    }

    if (semestersResponse.error) {
      setErrorMessage(semestersResponse.error.message);
    } else {
      setSemesters(semestersResponse.data ?? []);
    }

    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    if (!canAccessAdmin) {
      setAssignments([]);
      setSemesters([]);
      return;
    }

    void loadData();
  }, [canAccessAdmin, loadData]);

  const updateAssignment = (id: number, updates: Partial<AssignmentRow>) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? { ...assignment, ...updates } : assignment,
      ),
    );
  };

  const handleAssignmentSave = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const assignment = assignments.find((item) => item.id === id);
    if (!assignment) {
      return;
    }

    setAssignmentSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const now = new Date().toISOString();
    const { error } = await client
      .from("assignments")
      .update({
        title: assignment.title.trim(),
        description: assignment.description.trim(),
        due_date_utc: assignment.due_date_utc,
        semester_id: assignment.semester_id,
        modified_datetime_utc: now,
      })
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      updateAssignment(id, { modified_datetime_utc: now });
      setStatusMessage("Assignment updated.");
    }

    setAssignmentSaving(id, false);
  };

  const handleAssignmentDelete = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const assignment = assignments.find((item) => item.id === id);
    if (!assignment) {
      return;
    }

    if (
      !window.confirm(
        `Delete assignment "${assignment.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setAssignmentSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { error } = await client.from("assignments").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setAssignments((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Assignment deleted.");
    }

    setAssignmentSaving(id, false);
  };

  const handleAssignmentCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = supabase;
    if (!client) {
      return;
    }

    const title = newAssignment.title.trim();
    const description = newAssignment.description.trim();
    const dueDate = toUtcIso(newAssignment.dueDateLocal);
    const semesterId = Number(newAssignment.semesterId);

    if (!title || !hasRichTextContent(description) || !dueDate || !semesterId) {
      setErrorMessage("Complete all assignment fields before saving.");
      return;
    }

    setIsCreatingAssignment(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { data, error } = await client
      .from("assignments")
      .insert({
        title,
        description,
        due_date_utc: dueDate,
        semester_id: semesterId,
        created_datetime_utc: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setAssignments((prev) => [data, ...prev]);
      setNewAssignment(emptyAssignmentDraft);
      setStatusMessage("Assignment created.");
    }

    setIsCreatingAssignment(false);
  };

  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Assignments Admin</p>
          <h1>Assignments</h1>
          <p className="lead">
            Update assignment due dates, titles, and descriptions.
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
            <section className="card admin-section" aria-labelledby="assignments">
              <div className="admin-section__header">
                <div>
                  <h2 id="assignments">Assignments</h2>
                  <p className="admin-section__meta">
                    Edit titles, descriptions, due dates, and semester mapping.
                  </p>
                </div>
                <div className="admin-section__actions">
                  <span className="admin-badge">{assignments.length} total</span>
                  <button
                    className="admin-button"
                    type="button"
                    onClick={loadData}
                    disabled={isLoadingData}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {isLoadingData ? (
                <p className="admin-empty">Loading assignments...</p>
              ) : assignments.length === 0 ? (
                <p className="admin-empty">No assignments found yet.</p>
              ) : (
                <div className="admin-stack">
                  {sortedAssignments.map((assignment) => {
                    const isSaving = assignmentSavingIds.has(assignment.id);
                    const hasSemester = semesters.some(
                      (semester) => semester.id === assignment.semester_id,
                    );

                    return (
                      <div key={assignment.id} className="admin-panel">
                        <div className="admin-panel__header">
                          <div>
                            <p className="admin-panel__eyebrow">
                              Assignment #{assignment.id}
                            </p>
                            <p className="admin-panel__meta">
                              Due {formatTimestamp(assignment.due_date_utc)} -
                              Semester{" "}
                              {semesterNameById.get(assignment.semester_id) ??
                                assignment.semester_id}
                            </p>
                          </div>
                          <div className="admin-panel__actions">
                            <button
                              className="admin-button admin-button--primary"
                              type="button"
                              onClick={() => handleAssignmentSave(assignment.id)}
                              disabled={isSaving}
                            >
                              Save
                            </button>
                            <button
                              className="admin-button admin-button--ghost"
                              type="button"
                              onClick={() =>
                                handleAssignmentDelete(assignment.id)
                              }
                              disabled={isSaving}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="admin-panel__fields">
                          <label className="admin-field admin-field--wide">
                            <span className="admin-field__label">Title</span>
                            <input
                              className="admin-input"
                              type="text"
                              value={assignment.title}
                              onChange={(event) =>
                                updateAssignment(assignment.id, {
                                  title: event.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="admin-field admin-field--full">
                            <span className="admin-field__label">
                              Description
                            </span>
                            <RichTextEditor
                              value={assignment.description}
                              onChange={(nextValue) =>
                                updateAssignment(assignment.id, {
                                  description: nextValue,
                                })
                              }
                              ariaLabel={`Assignment ${assignment.id} description`}
                            />
                          </label>

                          <label className="admin-field">
                            <span className="admin-field__label">Due date</span>
                            <input
                              className="admin-input"
                              type="datetime-local"
                              value={toDatetimeLocal(assignment.due_date_utc)}
                              onChange={(event) =>
                                updateAssignment(assignment.id, {
                                  due_date_utc: toUtcIso(event.target.value),
                                })
                              }
                            />
                          </label>

                          <label className="admin-field">
                            <span className="admin-field__label">Semester</span>
                            <select
                              className="admin-select"
                              value={String(assignment.semester_id)}
                              onChange={(event) =>
                                updateAssignment(assignment.id, {
                                  semester_id: Number(event.target.value),
                                })
                              }
                            >
                              {!hasSemester && (
                                <option value={assignment.semester_id}>
                                  Unknown ({assignment.semester_id})
                                </option>
                              )}
                              {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                  {semester.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <p className="admin-panel__meta">
                          Created {formatTimestamp(assignment.created_datetime_utc)}{" "}
                          - Updated{" "}
                          {formatTimestamp(assignment.modified_datetime_utc)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <form
                className="admin-panel admin-panel--new"
                onSubmit={handleAssignmentCreate}
              >
                <div className="admin-panel__header">
                  <div>
                    <p className="admin-panel__eyebrow">New assignment</p>
                    <p className="admin-panel__meta">
                      Add a fresh assignment to the schedule.
                    </p>
                  </div>
                  <div className="admin-panel__actions">
                    <button
                      className="admin-button admin-button--primary"
                      type="submit"
                      disabled={isCreatingAssignment}
                    >
                      Create assignment
                    </button>
                  </div>
                </div>

                <div className="admin-panel__fields">
                  <label className="admin-field admin-field--wide">
                    <span className="admin-field__label">Title</span>
                    <input
                      className="admin-input"
                      type="text"
                      value={newAssignment.title}
                      onChange={(event) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">Description</span>
                    <RichTextEditor
                      value={newAssignment.description}
                      onChange={(nextValue) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          description: nextValue,
                        }))
                      }
                      ariaLabel="New assignment description"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="admin-field__label">Due date</span>
                    <input
                      className="admin-input"
                      type="datetime-local"
                      value={newAssignment.dueDateLocal}
                      onChange={(event) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          dueDateLocal: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span className="admin-field__label">Semester</span>
                    <select
                      className="admin-select"
                      value={newAssignment.semesterId}
                      onChange={(event) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          semesterId: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select semester</option>
                      {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.name}
                        </option>
                      ))}
                    </select>
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
