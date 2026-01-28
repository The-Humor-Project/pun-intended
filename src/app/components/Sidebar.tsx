"use client";

import {type SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import type {Session} from "@supabase/supabase-js";

import ThemeToggle from "./ThemeToggle";
import TimezoneSelect from "./TimezoneSelect";
import type {Tables} from "@/types/supabase";
import {supabase} from "@/app/lib/supabaseClient";
import {
    clearSupabaseAuthCookiesInBrowser,
    getSupabaseStorageKey,
    isInvalidRefreshTokenError,
} from "@/app/lib/supabaseAuthStorage";

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
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const hasSupabaseConfig = Boolean(supabase);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setIsOpen(mediaQuery.matches);

    apply();
    return listenForMediaChange(mediaQuery, apply);
  }, []);

  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(event.currentTarget.open);
  };

  const handleNavSelection = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia(DESKTOP_QUERY).matches) {
      return;
    }

    setIsOpen(false);
  }, []);

  const handleAccountToggle = useCallback(() => {
    setIsAccountOpen((prev) => !prev);
  }, []);

  const handleAccountAction = useCallback(() => {
    setIsAccountOpen(false);
    handleNavSelection();
  }, [handleNavSelection]);

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

    setIsAccountOpen(false);
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
    const storageKey = getSupabaseStorageKey(process.env.NEXT_PUBLIC_SUPABASE_URL);

    const recoverFromInvalidRefreshToken = async () => {
      clearSupabaseAuthCookiesInBrowser(storageKey);
      try {
        await client.auth.signOut();
      } catch {
        // No-op: we already cleared client-side cookies.
      }
    };

    const init = async () => {
      const { data, error } = await client.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        if (isInvalidRefreshTokenError(error)) {
          await recoverFromInvalidRefreshToken();
          setSession(null);
          setAuthError("Your session expired. Please sign in again.");
        } else {
          setAuthError(error.message);
        }
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

    setIsAccountOpen(false);
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

  useEffect(() => {
    if (!isAccountOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsAccountOpen(false);
    }
  }, [isOpen]);

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

  const accountSummary = accountDetails
    ? accountDetails.displayName
    : hasSupabaseConfig
      ? "Not signed in."
      : "Sign in unavailable.";

  const isAuthActionDisabled = isBooting || isWorking;

  return (
    <details className="sidebar" open={isOpen} onToggle={handleToggle}>
      <summary className="sidebar__toggle">
        <span className="sidebar__toggle-left">
          <span className="sidebar__toggle-icon" aria-hidden="true" />
          <span className="sidebar__toggle-label">Menu</span>
        </span>
        <span className="sidebar__brand sidebar__brand--compact" aria-hidden="true">
          <span className="logo-swap logo-swap--light">
            <Image
              className="sidebar__brand-mark"
              src="/columbia-crown-light.svg"
              alt=""
              width={56}
              height={56}
            />
          </span>
          <span className="logo-swap logo-swap--dark">
            <Image
              className="sidebar__brand-mark"
              src="/columbia-crown-dark.svg"
              alt=""
              width={56}
              height={56}
            />
          </span>
        </span>
      </summary>
      <div className="sidebar__body">
        <nav className="sidebar__nav" aria-label="Primary">
          <Link className="sidebar__link" href="/" onClick={handleNavSelection}>
            Overview
          </Link>
          <Link
            className="sidebar__link"
            href="/meeting-agendas"
            onClick={handleNavSelection}
          >
            Meeting Agendas
          </Link>
          <Link
            className="sidebar__link"
            href="/assignments"
            onClick={handleNavSelection}
          >
            Assignments
          </Link>
          <Link
            className="sidebar__link"
            href="/submissions"
            onClick={handleNavSelection}
          >
            Submissions
          </Link>
          <Link
            className="sidebar__link"
            href="/documentations"
            onClick={handleNavSelection}
          >
            Documentation
          </Link>
        </nav>
        <div className="sidebar__spacer" aria-hidden="true" />
        <div className="sidebar__footer">
          <div className="sidebar__account" ref={accountMenuRef}>
            <button
              className="sidebar__account-trigger"
              type="button"
              onClick={handleAccountToggle}
              aria-expanded={isAccountOpen}
              aria-controls="sidebar-account-menu"
              aria-haspopup="true"
            >
              <span className="sidebar__account-label">Account</span>
              <span className="sidebar__account-summary" aria-live="polite">
                {accountSummary}
              </span>
              <span
                className="sidebar__account-trigger-icon"
                aria-hidden="true"
              />
            </button>
            <div
              id="sidebar-account-menu"
              className={`sidebar__account-popout${
                isAccountOpen ? " is-open" : ""
              }`}
              role="region"
              aria-label="Account menu"
              aria-hidden={!isAccountOpen}
            >
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
                  {accountSummary}
                </span>
              )}
              {authError ? (
                  <span className="sidebar__account-error">{authError}</span>
                ) : null}
              <ThemeToggle />
              <TimezoneSelect />
              {session ? (
                <>
                  {isSuperadmin ? (
                    <Link
                      className="sidebar__account-button sidebar__account-button--center"
                      href="/admin"
                      onClick={handleAccountAction}
                    >
                      Admin
                    </Link>
                  ) : null}
                  <Link
                    className="sidebar__account-button sidebar__account-button--center"
                    href="/profile"
                    onClick={handleAccountAction}
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
      </div>
    </details>
  );
}
