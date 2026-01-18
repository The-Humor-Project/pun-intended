"use client";

import {type FormEvent, useCallback, useEffect, useMemo, useState} from "react";

import type {Tables} from "@/types/supabase";

import RichTextEditor from "@/app/admin/components/RichTextEditor";
import {useAdminSession} from "@/app/admin/lib/useAdminSession";
import {supabase} from "@/app/lib/supabaseClient";

type MeetingAgendaRow = Tables<"meeting_agendas">;
type SemesterRow = Tables<"semesters">;

type AgendaDraft = {
  title: string;
  content: string;
  location: string;
  meetingDateLocal: string;
  semesterId: string;
};

const emptyAgendaDraft: AgendaDraft = {
  title: "",
  content: "",
  location: "",
  meetingDateLocal: "",
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

export default function AgendasAdminPage() {
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

  const [agendas, setAgendas] = useState<MeetingAgendaRow[]>([]);
  const [semesters, setSemesters] = useState<SemesterRow[]>([]);
  const [agendaSavingIds, setAgendaSavingIds] = useState<Set<number>>(
    new Set(),
  );
  const [isCreatingAgenda, setIsCreatingAgenda] = useState(false);

  const [newAgenda, setNewAgenda] = useState<AgendaDraft>(emptyAgendaDraft);

  const semesterNameById = useMemo(() => {
    const map = new Map<number, string>();
    semesters.forEach((semester) => {
      map.set(semester.id, semester.name);
    });
    return map;
  }, [semesters]);

  const sortedAgendas = useMemo(() => {
    const copy = [...agendas];
    copy.sort((a, b) => {
      const aTime = new Date(a.meeting_datetime_utc).getTime();
      const bTime = new Date(b.meeting_datetime_utc).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return a.meeting_datetime_utc.localeCompare(b.meeting_datetime_utc);
      }
      return aTime - bTime;
    });
    return copy;
  }, [agendas]);

  const setAgendaSaving = (id: number, isSaving: boolean) => {
    setAgendaSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const loadAgendas = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setIsLoadingData(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const [agendasResponse, semestersResponse] = await Promise.all([
      client
        .from("meeting_agendas")
        .select("*")
        .order("meeting_datetime_utc", { ascending: true }),
      client
        .from("semesters")
        .select("*")
        .order("created_datetime_utc", { ascending: false }),
    ]);

    if (agendasResponse.error) {
      setErrorMessage(agendasResponse.error.message);
    } else {
      setAgendas(agendasResponse.data ?? []);
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
      setAgendas([]);
      setSemesters([]);
      return;
    }

    void loadAgendas();
  }, [canAccessAdmin, loadAgendas]);

  const updateAgenda = (id: number, updates: Partial<MeetingAgendaRow>) => {
    setAgendas((prev) =>
      prev.map((agenda) =>
        agenda.id === id ? { ...agenda, ...updates } : agenda,
      ),
    );
  };

  const handleAgendaSave = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const agenda = agendas.find((item) => item.id === id);
    if (!agenda) {
      return;
    }

    const title = agenda.title.trim();
    const content = agenda.content.trim();
    const location = agenda.location.trim();
    const meetingDate = agenda.meeting_datetime_utc;
    const semesterId = agenda.semester_id;

    if (
      !title ||
      !hasRichTextContent(content) ||
      !location ||
      !meetingDate ||
      !semesterId
    ) {
      setErrorMessage("Complete all agenda fields before saving.");
      return;
    }

    setAgendaSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const now = new Date().toISOString();
    const { error } = await client
      .from("meeting_agendas")
      .update({
        title,
        content,
        location,
        meeting_datetime_utc: meetingDate,
        semester_id: semesterId,
        modified_datetime_utc: now,
      })
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      updateAgenda(id, { modified_datetime_utc: now });
      setStatusMessage("Agenda updated.");
    }

    setAgendaSaving(id, false);
  };

  const handleAgendaDelete = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const agenda = agendas.find((item) => item.id === id);
    if (!agenda) {
      return;
    }

    if (
      !window.confirm(
        `Delete agenda "${agenda.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setAgendaSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { error } = await client.from("meeting_agendas").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setAgendas((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Agenda deleted.");
    }

    setAgendaSaving(id, false);
  };

  const handleAgendaCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = supabase;
    if (!client) {
      return;
    }

    const title = newAgenda.title.trim();
    const content = newAgenda.content.trim();
    const location = newAgenda.location.trim();
    const meetingDate = toUtcIso(newAgenda.meetingDateLocal);
    const semesterId = Number(newAgenda.semesterId);

    if (
      !title ||
      !hasRichTextContent(content) ||
      !location ||
      !meetingDate ||
      !semesterId
    ) {
      setErrorMessage("Complete all agenda fields before saving.");
      return;
    }

    setIsCreatingAgenda(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { data, error } = await client
      .from("meeting_agendas")
      .insert({
        title,
        content,
        location,
        meeting_datetime_utc: meetingDate,
        semester_id: semesterId,
        created_datetime_utc: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setAgendas((prev) => [data, ...prev]);
      setNewAgenda(emptyAgendaDraft);
      setStatusMessage("Agenda created.");
    }

    setIsCreatingAgenda(false);
  };

  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Meeting Agendas Admin</p>
          <h1>Meeting Agendas</h1>
          <p className="lead">
            Maintain meeting agendas, schedules, and discussion details.
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
          <section className="card admin-section" aria-labelledby="agendas">
            <div className="admin-section__header">
              <div>
                <h2 id="agendas">Agendas</h2>
                <p className="admin-section__meta">
                  Update titles, locations, meeting times, agenda content, and semesters.
                </p>
              </div>
              <div className="admin-section__actions">
                <span className="admin-badge">{agendas.length} total</span>
              </div>
            </div>

            {isLoadingData ? (
              <p className="admin-empty">Loading agendas...</p>
            ) : agendas.length === 0 ? (
              <p className="admin-empty">No agendas found yet.</p>
            ) : (
              <div className="admin-stack">
                {sortedAgendas.map((agenda) => {
                  const isSaving = agendaSavingIds.has(agenda.id);
                  const hasSemester = semesters.some(
                    (semester) => semester.id === agenda.semester_id,
                  );

                  return (
                    <div key={agenda.id} className="admin-panel">
                      <div className="admin-panel__header">
                        <div>
                          <p className="admin-panel__eyebrow">
                            Agenda #{agenda.id}
                          </p>
                          <p className="admin-panel__meta">
                            Meeting{" "}
                            {formatTimestamp(agenda.meeting_datetime_utc)} -
                            Location {agenda.location} - Semester{" "}
                            {semesterNameById.get(agenda.semester_id) ??
                              agenda.semester_id}
                          </p>
                        </div>
                        <div className="admin-panel__actions">
                          <button
                            className="admin-button admin-button--primary"
                            type="button"
                            onClick={() => handleAgendaSave(agenda.id)}
                            disabled={isSaving}
                          >
                            Save
                          </button>
                          <button
                            className="admin-button admin-button--ghost"
                            type="button"
                            onClick={() => handleAgendaDelete(agenda.id)}
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
                            value={agenda.title}
                            onChange={(event) =>
                              updateAgenda(agenda.id, {
                                title: event.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="admin-field admin-field--full">
                          <span className="admin-field__label">Content</span>
                          <RichTextEditor
                            value={agenda.content}
                            onChange={(nextValue) =>
                              updateAgenda(agenda.id, {
                                content: nextValue,
                              })
                            }
                            ariaLabel={`Agenda ${agenda.id} content`}
                          />
                        </div>

                        <label className="admin-field">
                          <span className="admin-field__label">Location</span>
                          <input
                            className="admin-input"
                            type="text"
                            value={agenda.location}
                            onChange={(event) =>
                              updateAgenda(agenda.id, {
                                location: event.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span className="admin-field__label">
                            Meeting time
                          </span>
                          <input
                            className="admin-input"
                            type="datetime-local"
                            value={toDatetimeLocal(agenda.meeting_datetime_utc)}
                            onChange={(event) =>
                              updateAgenda(agenda.id, {
                                meeting_datetime_utc: toUtcIso(
                                  event.target.value,
                                ),
                              })
                            }
                          />
                        </label>

                        <label className="admin-field">
                          <span className="admin-field__label">Semester</span>
                          <select
                            className="admin-select"
                            value={String(agenda.semester_id)}
                            onChange={(event) =>
                              updateAgenda(agenda.id, {
                                semester_id: Number(event.target.value),
                              })
                            }
                          >
                            {!hasSemester && (
                              <option value={agenda.semester_id}>
                                Unknown ({agenda.semester_id})
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
                        Created{" "}
                        {formatTimestamp(agenda.created_datetime_utc)} - Updated{" "}
                        {formatTimestamp(agenda.modified_datetime_utc)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <form
              className="admin-panel admin-panel--new"
              onSubmit={handleAgendaCreate}
            >
              <div className="admin-panel__header">
                <div>
                  <p className="admin-panel__eyebrow">New agenda</p>
                  <p className="admin-panel__meta">
                    Add a new meeting agenda.
                  </p>
                </div>
                <div className="admin-panel__actions">
                  <button
                    className="admin-button admin-button--primary"
                    type="submit"
                    disabled={isCreatingAgenda}
                  >
                    Create agenda
                  </button>
                </div>
              </div>

              <div className="admin-panel__fields">
                <label className="admin-field admin-field--wide">
                  <span className="admin-field__label">Title</span>
                  <input
                    className="admin-input"
                    type="text"
                    value={newAgenda.title}
                    onChange={(event) =>
                      setNewAgenda((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>

                <div className="admin-field admin-field--full">
                  <span className="admin-field__label">Content</span>
                  <RichTextEditor
                    value={newAgenda.content}
                    onChange={(nextValue) =>
                      setNewAgenda((prev) => ({
                        ...prev,
                        content: nextValue,
                      }))
                    }
                    ariaLabel="New agenda content"
                  />
                </div>

                <label className="admin-field">
                  <span className="admin-field__label">Location</span>
                  <input
                    className="admin-input"
                    type="text"
                    value={newAgenda.location}
                    onChange={(event) =>
                      setNewAgenda((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span className="admin-field__label">Meeting time</span>
                  <input
                    className="admin-input"
                    type="datetime-local"
                    value={newAgenda.meetingDateLocal}
                    onChange={(event) =>
                      setNewAgenda((prev) => ({
                        ...prev,
                        meetingDateLocal: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span className="admin-field__label">Semester</span>
                  <select
                    className="admin-select"
                    value={newAgenda.semesterId}
                    onChange={(event) =>
                      setNewAgenda((prev) => ({
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
        )}
      </div>
    </main>
  );
}
