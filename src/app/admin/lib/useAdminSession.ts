"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/app/lib/supabaseClient";

type AdminSessionState = {
  session: Session | null;
  isBooting: boolean;
  hasSupabaseConfig: boolean;
  isGoogleUser: boolean;
  canAccessAdmin: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAdminSession = (): AdminSessionState => {
  const [session, setSession] = useState<Session | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const hasSupabaseConfig = Boolean(supabase);

  const isGoogleUser = useMemo(() => {
    const provider = session?.user?.app_metadata?.provider;
    const identityProviders =
      session?.user?.identities?.map((identity) => identity.provider) ?? [];

    return provider === "google" || identityProviders.includes("google");
  }, [session]);

  const canAccessAdmin = Boolean(session) && isGoogleUser;

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

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
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

    setAuthError(null);

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      setAuthError(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    const client = supabase;
    if (!client) {
      return;
    }

    setAuthError(null);

    const { error } = await client.auth.signOut();

    if (error) {
      setAuthError(error.message);
    }
  }, []);

  return {
    session,
    isBooting,
    hasSupabaseConfig,
    isGoogleUser,
    canAccessAdmin,
    authError,
    clearAuthError,
    signInWithGoogle,
    signOut,
  };
};
