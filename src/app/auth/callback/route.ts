import { NextRequest, NextResponse } from "next/server";

import type { Tables } from "@/types/supabase";

import { createSupabaseServerClient } from "@/app/lib/supabaseServerClient";

type ProfileAdminFlag = Pick<Tables<"profiles">, "is_superadmin">;

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

  const supabase = await createSupabaseServerClient();
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_superadmin")
      .eq("id", user.id)
      .single<ProfileAdminFlag>();

    if (profileError) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(
          "Error checking user profile",
        )}`,
      );
    }

    if (!profile || !profile.is_superadmin) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(
          "Access denied. Superadmin privileges required.",
        )}`,
      );
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
