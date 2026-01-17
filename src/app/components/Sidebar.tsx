"use client";

import {type SyntheticEvent, useCallback, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import type {Session} from "@supabase/supabase-js";

import ThemeToggle from "./ThemeToggle";
import type {Tables} from "@/types/supabase";
import {supabase} from "@/app/lib/supabaseClient";

const DESKTOP_QUERY = "(min-width: 901px)";

const listenForMediaChange = (
  mediaQuery: MediaQueryList,
  handler: () => void,
) => {
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handler);
  } else {
    mediaQuery.addListener(handler);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handler);
    } else {
      mediaQuery.removeListener(handler);
    }
  };
};

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const hasSupabaseConfig = Boolean(supabase);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setIsOpen(mediaQuery.matches);

    apply();
    return listenForMediaChange(mediaQuery, apply);
  }, []);

  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(event.currentTarget.open);
  };

  const handleSignIn = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      setAuthError("NEXT_PUBLIC_SITE_URL is not configured.");
      return;
    }

    const redirectUrl = new URL("/auth/callback", siteUrl);

    setIsWorking(true);
    setAuthError(null);

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      setAuthError(error.message);
      setIsWorking(false);
    }
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setIsBooting(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      const { data, error } = await client.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session ?? null);
      setIsBooting(false);
    };

    void init();

    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client || !session?.user?.id) {
      setIsSuperadmin(false);
      return;
    }

    let mounted = true;

    const loadAdminFlag = async () => {
      const { data, error } = await client
        .from("profiles")
        .select("is_superadmin")
        .eq("id", session.user.id)
        .single<Pick<Tables<"profiles">, "is_superadmin">>();

      if (!mounted) {
        return;
      }

      if (error) {
        setIsSuperadmin(false);
        return;
      }

      setIsSuperadmin(Boolean(data?.is_superadmin));
    };

    void loadAdminFlag();

    return () => {
      mounted = false;
    };
  }, [session]);

  const handleSignOut = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setIsWorking(true);
    setAuthError(null);

    const { error } = await client.auth.signOut();

    if (error) {
      setAuthError(error.message);
    }

    setIsWorking(false);
    router.push("/login");
    router.refresh();
  }, [router]);

  const accountDetails = useMemo(() => {
    if (!session?.user) {
      return null;
    }

    const metadata = session.user.user_metadata ?? {};
    const fullName =
      typeof metadata.full_name === "string" ? metadata.full_name : undefined;
    const name = typeof metadata.name === "string" ? metadata.name : undefined;
    const email = session.user.email ?? undefined;
    const displayName = fullName ?? name ?? email ?? "Signed in user";
    const secondary = email && email !== displayName ? email : null;

    return { displayName, secondary };
  }, [session]);

  const isAuthActionDisabled = isBooting || isWorking;

  return (
    <details className="sidebar" open={isOpen} onToggle={handleToggle}>
      <summary className="sidebar__toggle">
        <span className="sidebar__toggle-icon" aria-hidden="true" />
        <span className="sidebar__toggle-label">Menu</span>
      </summary>
      <div className="sidebar__body">
        <nav className="sidebar__nav" aria-label="Primary">
          <Link className="sidebar__link" href="/">
            Overview
          </Link>
          <Link className="sidebar__link" href="/meeting-agendas">
            Meeting Agendas
          </Link>
          <Link className="sidebar__link" href="/assignments">
            Assignments
          </Link>
          <Link className="sidebar__link" href="/submissions">
            Submissions
          </Link>
        </nav>
        <div className="sidebar__spacer" aria-hidden="true" />
        <div className="sidebar__footer">
          <ThemeToggle />
          <div className="sidebar__account" aria-live="polite">
            <span className="sidebar__account-label">Account</span>
            {accountDetails ? (
              <div className="sidebar__account-details">
                <span className="sidebar__account-name">
                  {accountDetails.displayName}
                </span>
                {accountDetails.secondary ? (
                  <span className="sidebar__account-email">
                    {accountDetails.secondary}
                  </span>
                ) : null}
              </div>
            ) : (
              <span className="sidebar__account-empty">
                {hasSupabaseConfig ? "Not signed in." : "Sign in unavailable."}
              </span>
            )}
            {authError ? (
              <span className="sidebar__account-error">{authError}</span>
            ) : null}
            {session ? (
              <>
                {isSuperadmin ? (
                  <Link
                    className="sidebar__account-button sidebar__account-button--center"
                    href="/admin"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  className="sidebar__account-button sidebar__account-button--center"
                  href="/profile"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="sidebar__account-button"
                  onClick={handleSignOut}
                  disabled={isAuthActionDisabled}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="sidebar__account-button"
                onClick={handleSignIn}
                disabled={isAuthActionDisabled}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </details>
  );
}
