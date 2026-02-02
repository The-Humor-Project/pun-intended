import {createServerClient, type SetAllCookies} from "@supabase/ssr";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

import {
    clearSupabaseAuthCookiesWithSetter,
    getSupabaseStorageKey,
    isInvalidRefreshTokenError,
} from "@/app/lib/supabaseAuthStorage";

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

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/assignments",
    "/assignment/:path*",
    "/documentations",
    "/documentation/:path*",
    "/meeting-agendas",
    "/profile",
    "/complete-profile",
    "/submissions",
    "/studies",
  ],
};
