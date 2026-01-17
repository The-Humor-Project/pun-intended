"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import type {Session} from "@supabase/supabase-js";
import {useRouter} from "next/navigation";

import {supabase} from "@/app/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const hasSupabaseConfig = Boolean(supabase);

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

  const isAuthDisabled = !hasSupabaseConfig || isBooting || isWorking;

  return (
    <main className="page">
      <div className="page__content">
        <section className="card auth-card" aria-labelledby="login-title">
          <h2
            id="login-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Account
          </h2>
          <p className="lead">
            Sign in to access course materials.
          </p>

          <div className="auth-card__panel" aria-live="polite">
            <span className="auth-card__label">Status</span>
            {isBooting ? (
              <span className="auth-card__note">Checking your session...</span>
            ) : accountDetails ? (
              <div className="auth-card__identity">
                <span className="auth-card__name">
                  {accountDetails.displayName}
                </span>
                {accountDetails.secondary ? (
                  <span className="auth-card__email">
                    {accountDetails.secondary}
                  </span>
                ) : null}
              </div>
            ) : (
              <span className="auth-card__note">
                {hasSupabaseConfig ? "Not signed in." : "Sign in unavailable."}
              </span>
            )}

            {authError ? (
              <span className="auth-card__error">{authError}</span>
            ) : null}

            <button
              type="button"
              className="auth-card__button"
              onClick={session ? handleSignOut : handleSignIn}
              disabled={isAuthDisabled}
            >
              {session ? "Sign Out" : "Sign In with Google"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
