"use client";

import {type FormEvent, useCallback, useState} from "react";

import {supabase} from "@/app/lib/supabaseClient";

type ProfileFormProps = {
  userId: string;
  initialFirstName: string | null;
  initialLastName: string | null;
};

export default function ProfileForm({
  userId,
  initialFirstName,
  initialLastName,
}: ProfileFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isReady =
    firstName.trim().length > 0 && lastName.trim().length > 0;
  const isSubmitDisabled = !supabase || isSaving || !isReady;

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!supabase) {
        setError("Sign in unavailable.");
        return;
      }

      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();

      if (!trimmedFirst || !trimmedLast) {
        setError("Please enter your first and last name.");
        return;
      }

      setIsSaving(true);
      setError(null);
      setStatus(null);

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: trimmedFirst,
          last_name: trimmedLast,
          modified_datetime_utc: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("first_name, last_name")
        .single();

      if (updateError) {
        setError(updateError.message);
        setIsSaving(false);
        return;
      }

      if (!data) {
        setError("Unable to save your profile. Please try again.");
        setIsSaving(false);
        return;
      }

      setFirstName(data.first_name ?? "");
      setLastName(data.last_name ?? "");
      setStatus("Profile updated.");
      setIsSaving(false);
    },
    [firstName, lastName, userId],
  );

  return (
    <form className="auth-card__panel" onSubmit={handleSubmit} aria-live="polite">
      <label className="auth-card__field">
        <span className="auth-card__label">First name</span>
        <input
          className="auth-card__input"
          type="text"
          name="first_name"
          autoComplete="given-name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          disabled={isSaving}
          required
        />
      </label>
      <label className="auth-card__field">
        <span className="auth-card__label">Last name</span>
        <input
          className="auth-card__input"
          type="text"
          name="last_name"
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          disabled={isSaving}
          required
        />
      </label>
      {status ? (
        <span className="auth-card__note" role="status">
          {status}
        </span>
      ) : null}
      {error ? <span className="auth-card__error">{error}</span> : null}
      <button
        className="auth-card__button"
        type="submit"
        disabled={isSubmitDisabled}
      >
        {isSaving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
