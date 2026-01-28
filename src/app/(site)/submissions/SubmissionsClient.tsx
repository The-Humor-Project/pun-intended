"use client";

import {type CSSProperties, type FormEvent, useCallback, useEffect, useMemo, useState,} from "react";

import type {Tables} from "@/types/supabase";

import {supabase} from "@/app/lib/supabaseClient";

type AssignmentSummary = Pick<
  Tables<"assignments">,
  "id" | "title" | "due_date_utc"
>;
type SubmissionSummary = Pick<
  Tables<"submissions">,
  "id" | "assignment_id" | "content" | "created_datetime_utc"
>;

type SubmissionsClientProps = {
  assignments: AssignmentSummary[];
  submissions: SubmissionSummary[];
  timeZone?: string;
  userId: string;
};

const revealDelay = (index: number): CSSProperties => ({
  animationDelay: `${80 + index * 60}ms`,
});

const formatDueDate = (value: string, timeZone?: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: "long" };
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
  };

  if (timeZone) {
    weekdayOptions.timeZone = timeZone;
    dateTimeOptions.timeZone = timeZone;
  }

  const weekday = date.toLocaleDateString(undefined, weekdayOptions);
  return `${weekday}, ${date.toLocaleString(undefined, dateTimeOptions)}`;
};

const formatSubmissionDate = (value: string, timeZone?: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  if (timeZone) {
    options.timeZone = timeZone;
    options.timeZoneName = "short";
  }

  try {
    return new Intl.DateTimeFormat(undefined, options).format(date);
  } catch {
    return date.toLocaleString();
  }
};

const isPastDue = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.getTime() < Date.now();
};

export default function SubmissionsClient({
  assignments,
  submissions,
  timeZone,
  userId,
}: SubmissionsClientProps) {
  const [submissionRows, setSubmissionRows] =
    useState<SubmissionSummary[]>(submissions);
  const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(
    null,
  );
  const [draftContent, setDraftContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const activeAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === activeAssignmentId),
    [assignments, activeAssignmentId],
  );

  const submissionsByAssignment = useMemo(() => {
    const grouped = new Map<number, SubmissionSummary[]>();
    submissionRows.forEach((submission) => {
      const list = grouped.get(submission.assignment_id) ?? [];
      list.push(submission);
      grouped.set(submission.assignment_id, list);
    });
    grouped.forEach((list) =>
      list.sort((a, b) => {
        const aTime = new Date(a.created_datetime_utc).getTime();
        const bTime = new Date(b.created_datetime_utc).getTime();
        if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
          return b.created_datetime_utc.localeCompare(a.created_datetime_utc);
        }
        return bTime - aTime;
      }),
    );
    return grouped;
  }, [submissionRows]);

  const closeModal = useCallback(() => {
    setActiveAssignmentId(null);
    setDraftContent("");
    setError(null);
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (isSaving) {
      return;
    }
    closeModal();
  }, [closeModal, isSaving]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isSaving) {
        return;
      }
      event.preventDefault();
      closeModal();
    },
    [closeModal, isSaving],
  );

  useEffect(() => {
    if (!activeAssignmentId) {
      return;
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeAssignmentId, handleEscape]);

  const handleOpenModal = useCallback((assignmentId: number) => {
    setActiveAssignmentId(assignmentId);
    setDraftContent("");
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!supabase) {
        setError("Submissions are unavailable right now.");
        return;
      }

      if (!activeAssignment) {
        setError("Please choose an assignment.");
        return;
      }

      const trimmed = draftContent.trim();
      if (!trimmed) {
        setError("Please add your submission.");
        return;
      }

      setIsSaving(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("submissions")
        .insert({
          assignment_id: activeAssignment.id,
          profile_id: userId,
          content: trimmed,
          created_datetime_utc: new Date().toISOString(),
        })
        .select("id, assignment_id, content, created_datetime_utc")
        .single();

      if (insertError) {
        setError(insertError.message);
        setIsSaving(false);
        return;
      }

      if (!data) {
        setError("Unable to save your submission. Please try again.");
        setIsSaving(false);
        return;
      }

      setSubmissionRows((prev) => [data, ...prev]);
      setIsSaving(false);
      closeModal();
    },
    [activeAssignment, closeModal, draftContent, userId],
  );

  const isSubmitDisabled = !supabase || isSaving || !draftContent.trim();

  if (assignments.length === 0) {
    return <p className="week__empty">No assignments yet.</p>;
  }

  return (
    <>
      <ul className="assignments-list submissions-listing">
        {assignments.map((assignment, index) => {
          const assignmentSubmissions =
            submissionsByAssignment.get(assignment.id) ?? [];
          const pastDue = isPastDue(assignment.due_date_utc);

          return (
            <li
              key={assignment.id}
              className="assignments-list__item reveal"
              style={revealDelay(index)}
            >
              <div className="assignments-list__card submissions-card">
                <div className="assignments-list__header submissions-card__header">
                  <span className="assignments-list__title">
                    {assignment.title}
                  </span>
                  <div className="submissions-card__actions">
                    {pastDue ? (
                      <span className="submissions-card__status">
                        Submissions closed
                      </span>
                    ) : (
                      <button
                        className="assignments-list__button"
                        type="button"
                        onClick={() => handleOpenModal(assignment.id)}
                        disabled={!supabase}
                      >
                        Create Submission
                      </button>
                    )}
                  </div>
                </div>
                <div className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    {formatDueDate(assignment.due_date_utc, timeZone)}
                  </span>
                </div>
                <div className="submissions-card__section">
                  <div className="submissions-card__subheader">
                    <span className="submissions-card__label">
                      Your submissions
                    </span>
                    <span className="submissions-card__count">
                      {assignmentSubmissions.length} total
                    </span>
                  </div>
                  {assignmentSubmissions.length === 0 ? (
                    <p className="submissions-card__empty">
                      No submissions yet.
                    </p>
                  ) : (
                    <ul className="submissions-entries">
                      {assignmentSubmissions.map((submission) => (
                        <li key={submission.id} className="submissions-entry">
                          <div className="submissions-entry__meta">
                            <span className="submissions-entry__label">
                              Submitted
                            </span>
                            <span className="submissions-entry__value">
                              {formatSubmissionDate(
                                submission.created_datetime_utc,
                                timeZone,
                              )}
                            </span>
                          </div>
                          <p
                            className={
                              submission.content
                                ? "submissions-entry__content"
                                : "submissions-entry__content submissions-entry__content--muted"
                            }
                          >
                            {submission.content?.trim().length
                              ? submission.content
                              : "No details provided."}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {activeAssignment ? (
        <div
          className="submission-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-modal-title"
          onClick={handleOverlayClick}
        >
          <div
            className="submission-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="submission-modal__header">
              <div>
                <h3 id="submission-modal-title" className="submission-modal__title">
                  New submission
                </h3>
                <p className="submission-modal__subtitle">
                  {activeAssignment.title} · Due{" "}
                  {formatDueDate(activeAssignment.due_date_utc, timeZone)}
                </p>
              </div>
              <button
                className="submission-modal__close"
                type="button"
                onClick={closeModal}
                disabled={isSaving}
              >
                Close
              </button>
            </div>
            <form className="submission-modal__form" onSubmit={handleSubmit}>
              <label className="submission-modal__field">
                <span className="submission-modal__label">Your submission</span>
                <textarea
                  className="submission-modal__textarea"
                  name="content"
                  rows={6}
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                  disabled={isSaving}
                  autoFocus
                  required
                />
              </label>
              {error ? (
                <p className="submission-modal__error" role="status">
                  {error}
                </p>
              ) : null}
              <div className="submission-modal__actions">
                <button
                  className="submission-modal__button"
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="submission-modal__button submission-modal__button--primary"
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  {isSaving ? "Saving..." : "Submit submission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
