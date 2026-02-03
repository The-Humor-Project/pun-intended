import {createServerClient, type SetAllCookies} from "@supabase/ssr";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

import {
    clearSupabaseAuthCookiesWithSetter,
    getSupabaseStorageKey,
    isInvalidRefreshTokenError,
} from "@/app/lib/supabaseAuthStorage";

const isAllowedSchoolEmail = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  return (
    normalized.endsWith("@columbia.edu") ||
    normalized.endsWith("@barnard.edu")
  );
};

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let response = NextResponse.next({ request });
  const storageKey = getSupabaseStorageKey(supabaseUrl);
  const clearAuthCookies = (targetResponse: NextResponse) => {
    clearSupabaseAuthCookiesWithSetter(storageKey, (name, value, options) => {
      request.cookies.set(name, value);
      targetResponse.cookies.set(name, value, options);
    });
  };

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getSession();

  if (isInvalidRefreshTokenError(error)) {
    const redirectResponse = NextResponse.redirect(
      new URL("/login", request.url),
    );
    clearAuthCookies(redirectResponse);
    return redirectResponse;
  }

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const email = data.session.user?.email ?? null;
  if (!isAllowedSchoolEmail(email)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set(
      "error",
      "Please sign in with a columbia.edu or barnard.edu email address.",
    );
    const redirectResponse = NextResponse.redirect(redirectUrl);
    clearAuthCookies(redirectResponse);
    return redirectResponse;
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_superadmin")
      .eq("id", data.session.user.id)
      .single();

    if (profileError || !profile?.is_superadmin) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
