"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Tables, TablesUpdate } from "@/types/supabase";

import { useAdminSession } from "@/app/admin/lib/useAdminSession";
import { supabase } from "@/app/lib/supabaseClient";

type ProfileRow = Tables<"profiles"> & { is_superadmin: boolean | null };
type ProfileUpdate = TablesUpdate<"profiles"> & {
  is_superadmin?: boolean | null;
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

const getDisplayName = (profile: ProfileRow) => {
  const parts = [profile.first_name, profile.last_name].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(" ");
  }

  return "Unnamed user";
};

const normalizeSearchTerm = (value: string) =>
  value.replace(/,/g, " ").trim();

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );

export default function UsersAdminPage() {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!canAccessAdmin) {
      setProfiles([]);
      setHasSearched(false);
    }
  }, [canAccessAdmin]);

  const setProfileSaving = (id: string, isSaving: boolean) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const updateProfile = (id: string, updates: Partial<ProfileRow>) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id ? { ...profile, ...updates } : profile,
      ),
    );
  };

  const handleSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const client = supabase;
      if (!client) {
        return;
      }

      const term = normalizeSearchTerm(searchQuery);
      if (!term) {
        setErrorMessage("Enter a name or email to search.");
        return;
      }

      setIsSearching(true);
      setHasSearched(true);
      setErrorMessage(null);
      setStatusMessage(null);

      const pattern = `%${term}%`;
      const filters = [
        `email.ilike.${pattern}`,
        `first_name.ilike.${pattern}`,
        `last_name.ilike.${pattern}`,
      ];

      if (isUuid(term)) {
        filters.push(`id.eq.${term}`);
      }

      const { data, error } = await client
        .from("profiles")
        .select(
          "id, email, first_name, last_name, created_datetime_utc, modified_datetime_utc, is_superadmin",
        )
        .or(filters.join(","))
        .order("created_datetime_utc", { ascending: false })
        .limit(50);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setProfiles((data ?? []) as ProfileRow[]);
      }

      setIsSearching(false);
    },
    [searchQuery],
  );

  const handleToggleSuperadmin = async (profile: ProfileRow) => {
    const client = supabase;
    if (!client) {
      return;
    }

    const nextValue = !Boolean(profile.is_superadmin);

    setProfileSaving(profile.id, true);
    setErrorMessage(null);
    setStatusMessage(null);

    const now = new Date().toISOString();
    const updates: ProfileUpdate = {
      is_superadmin: nextValue,
      modified_datetime_utc: now,
    };

    const { error } = await client
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      setErrorMessage(error.message);
    } else {
      updateProfile(profile.id, {
        is_superadmin: nextValue,
        modified_datetime_utc: now,
      });
      setStatusMessage(
        nextValue
          ? "User granted superadmin access."
          : "Superadmin access revoked.",
      );
    }

    setProfileSaving(profile.id, false);
  };

  return (
    <main className="admin-page">
      <div className="admin-content">
        <header className="hero admin-hero">
          <p className="eyebrow">Users Admin</p>
          <h1>Users</h1>
          <p className="lead">
            Search profiles and manage superadmin access.
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
          <section className="card admin-section" aria-labelledby="users">
            <div className="admin-section__header">
              <div>
                <h2 id="users">Users</h2>
                <p className="admin-section__meta">
                  Search by email, name, or ID to manage superadmins.
                </p>
              </div>
              <div className="admin-section__actions">
                <span className="admin-badge">
                  {hasSearched ? `${profiles.length} results` : "No search yet"}
                </span>
              </div>
            </div>

            <form className="admin-panel" onSubmit={handleSearch}>
              <div className="admin-panel__header">
                <div>
                  <p className="admin-panel__eyebrow">Search profiles</p>
                  <p className="admin-panel__meta">
                    Find users by email address, name, or UUID.
                  </p>
                </div>
                <div className="admin-panel__actions">
                  <button
                    className="admin-button admin-button--primary"
                    type="submit"
                    disabled={isSearching}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="admin-panel__fields">
                <label className="admin-field admin-field--wide">
                  <span className="admin-field__label">Search</span>
                  <input
                    className="admin-input"
                    type="search"
                    placeholder="Email, name, or UUID"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>
              </div>
            </form>

            {isSearching ? (
              <p className="admin-empty">Searching users...</p>
            ) : profiles.length === 0 ? (
              <p className="admin-empty">
                {hasSearched
                  ? "No users found for this search."
                  : "Search for a user to see results."}
              </p>
            ) : (
              <div className="admin-stack">
                {profiles.map((profile) => {
                  const isSaving = savingIds.has(profile.id);
                  const isSuperadmin = Boolean(profile.is_superadmin);

                  return (
                    <div key={profile.id} className="admin-panel">
                      <div className="admin-panel__header">
                        <div>
                          <p className="admin-panel__eyebrow">
                            {getDisplayName(profile)}
                          </p>
                          <p className="admin-panel__meta">
                            {profile.email} · {profile.id}
                          </p>
                        </div>
                        <div className="admin-panel__actions">
                          <span className="admin-badge">
                            {isSuperadmin ? "Superadmin" : "Standard user"}
                          </span>
                          <button
                            className="admin-button admin-button--primary"
                            type="button"
                            onClick={() => handleToggleSuperadmin(profile)}
                            disabled={isSaving}
                          >
                            {isSuperadmin
                              ? "Revoke superadmin"
                              : "Make superadmin"}
                          </button>
                        </div>
                      </div>

                      <div className="admin-panel__fields">
                        <div className="admin-field">
                          <span className="admin-field__label">Email</span>
                          <span>{profile.email}</span>
                        </div>
                        <div className="admin-field">
                          <span className="admin-field__label">Name</span>
                          <span>{getDisplayName(profile)}</span>
                        </div>
                        <div className="admin-field">
                          <span className="admin-field__label">Role</span>
                          <span>
                            {isSuperadmin ? "Superadmin" : "Standard user"}
                          </span>
                        </div>
                      </div>

                      <p className="admin-panel__meta">
                        Created{" "}
                        {formatTimestamp(profile.created_datetime_utc)} -
                        Updated {formatTimestamp(profile.modified_datetime_utc)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
