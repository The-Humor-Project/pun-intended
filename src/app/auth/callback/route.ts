import {NextRequest, NextResponse} from "next/server";

import type {Tables} from "@/types/supabase";

import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

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

const getOrigin = (request: NextRequest) => {
  const host = request.headers.get("host") ?? "";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = getOrigin(request);

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("No code provided")}`,
    );
  }

  const supabase = await createSupabaseServerClient({
    allowSetCookies: true,
  });
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Failed to sign in")}`,
    );
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(
          "Failed to get user information",
        )}`,
      );
    }

    if (!isAllowedSchoolEmail(user.email ?? null)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(
          "Please sign in with a columbia.edu or barnard.edu email address.",
        )}`,
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single<Pick<Tables<"profiles">, "first_name" | "last_name">>();

    const firstName = profile?.first_name?.trim() ?? "";
    const lastName = profile?.last_name?.trim() ?? "";

    if (!firstName || !lastName) {
      return NextResponse.redirect(new URL("/complete-profile", origin));
    }

    return NextResponse.redirect(new URL("/", origin));
  } catch (error) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "An unexpected error occurred during sign in",
      )}`,
    );
  }
}
