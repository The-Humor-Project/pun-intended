"use client";

import {type FormEvent, useCallback, useEffect, useMemo, useState} from "react";

import type {Tables} from "@/types/supabase";

import RichTextEditor from "@/app/admin/components/RichTextEditor";
import {useAdminSession} from "@/app/admin/lib/useAdminSession";
import {supabase} from "@/app/lib/supabaseClient";

type DocumentationRow = Tables<"documentations">;

type DocumentationDraft = {
  title: string;
  content: string;
};

const emptyDocumentationDraft: DocumentationDraft = {
  title: "",
  content: "",
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

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

const hasRichTextContent = (value: string) => stripHtml(value).length > 0;

export default function DocumentationsAdminPage() {
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

  const [documentations, setDocumentations] = useState<DocumentationRow[]>([]);
  const [documentationSavingIds, setDocumentationSavingIds] = useState<
    Set<number>
  >(new Set());
  const [isCreatingDocumentation, setIsCreatingDocumentation] =
    useState(false);

  const [newDocumentation, setNewDocumentation] =
    useState<DocumentationDraft>(emptyDocumentationDraft);

  const sortedDocumentations = useMemo(() => {
    const copy = [...documentations];
    copy.sort((a, b) => {
      const aStamp = a.modified_datetime_utc ?? a.created_datetime_utc;
      const bStamp = b.modified_datetime_utc ?? b.created_datetime_utc;
      const aTime = new Date(aStamp).getTime();
      const bTime = new Date(bStamp).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return bStamp.localeCompare(aStamp);
      }
      return bTime - aTime;
    });
    return copy;
  }, [documentations]);

  const setDocumentationSaving = (id: number, isSaving: boolean) => {
    setDocumentationSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const loadDocumentations = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setIsLoadingData(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const documentationsResponse = await client
      .from("documentations")
      .select("*")
      .order("created_datetime_utc", { ascending: false });

    if (documentationsResponse.error) {
      setErrorMessage(documentationsResponse.error.message);
    } else {
      setDocumentations(documentationsResponse.data ?? []);
    }

    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    if (!canAccessAdmin) {
      setDocumentations([]);
      return;
    }

    void loadDocumentations();
  }, [canAccessAdmin, loadDocumentations]);

  const updateDocumentation = (
    id: number,
    updates: Partial<DocumentationRow>,
  ) => {
    setDocumentations((prev) =>
      prev.map((documentation) =>
        documentation.id === id
          ? { ...documentation, ...updates }
          : documentation,
      ),
    );
  };

  const handleDocumentationSave = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const documentation = documentations.find((item) => item.id === id);
    if (!documentation) {
      return;
    }

    const title = documentation.title.trim();
    const content = documentation.content.trim();

    if (!title || !hasRichTextContent(content)) {
      setErrorMessage("Complete all documentation fields before saving.");
      return;
    }

    setDocumentationSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const now = new Date().toISOString();
    const { error } = await client
      .from("documentations")
      .update({
        title,
        content,
        modified_datetime_utc: now,
      })
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      updateDocumentation(id, { modified_datetime_utc: now });
      setStatusMessage("Documentation updated.");
    }

    setDocumentationSaving(id, false);
  };

  const handleDocumentationDelete = async (id: number) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const documentation = documentations.find((item) => item.id === id);
    if (!documentation) {
      return;
    }

    if (
      !window.confirm(
        `Delete documentation "${documentation.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDocumentationSaving(id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { error } = await client.from("documentations").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setDocumentations((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Documentation deleted.");
    }

    setDocumentationSaving(id, false);
  };

  const handleDocumentationCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = supabase;
    if (!client) {
      return;
    }

    const title = newDocumentation.title.trim();
    const content = newDocumentation.content.trim();

    if (!title || !hasRichTextContent(content)) {
      setErrorMessage("Complete all documentation fields before saving.");
      return;
    }

    setIsCreatingDocumentation(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const { data, error } = await client
      .from("documentations")
      .insert({
        title,
        content,
        created_datetime_utc: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setDocumentations((prev) => [data, ...prev]);
      setNewDocumentation(emptyDocumentationDraft);
      setStatusMessage("Documentation created.");
    }

    setIsCreatingDocumentation(false);
  };

  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Documentation Admin</p>
          <h1>Documentation</h1>
          <p className="lead">
            Publish and maintain course documentation for students.
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
          <section
            className="card admin-section"
            aria-labelledby="documentation-admin"
          >
            <div className="admin-section__header">
              <div>
                <h2 id="documentation-admin">Documentation</h2>
                <p className="admin-section__meta">
                  Edit documentation titles and content.
                </p>
              </div>
              <div className="admin-section__actions">
                <span className="admin-badge">
                  {documentations.length} total
                </span>
                <button
                  className="admin-button"
                  type="button"
                  onClick={loadDocumentations}
                  disabled={isLoadingData}
                >
                  Refresh
                </button>
              </div>
            </div>

            {isLoadingData ? (
              <p className="admin-empty">Loading documentation...</p>
            ) : documentations.length === 0 ? (
              <p className="admin-empty">No documentation entries yet.</p>
            ) : (
              <div className="admin-stack">
                {sortedDocumentations.map((documentation) => {
                  const isSaving = documentationSavingIds.has(documentation.id);
                  const lastUpdated =
                    documentation.modified_datetime_utc ??
                    documentation.created_datetime_utc;

                  return (
                    <div key={documentation.id} className="admin-panel">
                      <div className="admin-panel__header">
                        <div>
                          <p className="admin-panel__eyebrow">
                            Documentation #{documentation.id}
                          </p>
                          <p className="admin-panel__meta">
                            Last updated {formatTimestamp(lastUpdated)}
                          </p>
                        </div>
                        <div className="admin-panel__actions">
                          <button
                            className="admin-button admin-button--primary"
                            type="button"
                            onClick={() =>
                              handleDocumentationSave(documentation.id)
                            }
                            disabled={isSaving}
                          >
                            Save
                          </button>
                          <button
                            className="admin-button admin-button--ghost"
                            type="button"
                            onClick={() =>
                              handleDocumentationDelete(documentation.id)
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
                            value={documentation.title}
                            onChange={(event) =>
                              updateDocumentation(documentation.id, {
                                title: event.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="admin-field admin-field--full">
                          <span className="admin-field__label">Content</span>
                          <RichTextEditor
                            value={documentation.content}
                            onChange={(nextValue) =>
                              updateDocumentation(documentation.id, {
                                content: nextValue,
                              })
                            }
                            ariaLabel={`Documentation ${documentation.id} content`}
                          />
                        </div>
                      </div>

                      <p className="admin-panel__meta">
                        Created {formatTimestamp(
                          documentation.created_datetime_utc,
                        )} - Updated {formatTimestamp(
                          documentation.modified_datetime_utc,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <form
              className="admin-panel admin-panel--new"
              onSubmit={handleDocumentationCreate}
            >
              <div className="admin-panel__header">
                <div>
                  <p className="admin-panel__eyebrow">New documentation</p>
                  <p className="admin-panel__meta">
                    Add a new documentation page for students.
                  </p>
                </div>
                <div className="admin-panel__actions">
                  <button
                    className="admin-button admin-button--primary"
                    type="submit"
                    disabled={isCreatingDocumentation}
                  >
                    Create documentation
                  </button>
                </div>
              </div>

              <div className="admin-panel__fields">
                <label className="admin-field admin-field--wide">
                  <span className="admin-field__label">Title</span>
                  <input
                    className="admin-input"
                    type="text"
                    value={newDocumentation.title}
                    onChange={(event) =>
                      setNewDocumentation((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>

                <div className="admin-field admin-field--full">
                  <span className="admin-field__label">Content</span>
                  <RichTextEditor
                    value={newDocumentation.content}
                    onChange={(nextValue) =>
                      setNewDocumentation((prev) => ({
                        ...prev,
                        content: nextValue,
                      }))
                    }
                    ariaLabel="New documentation content"
                  />
                </div>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
