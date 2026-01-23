"use server";

import {createServerClient, type SetAllCookies} from "@supabase/ssr";
import type {SupabaseClient} from "@supabase/supabase-js";
import {cookies} from "next/headers";

import type {Database} from "@/types/supabase";

type SupabaseServerClientOptions = {
  allowSetCookies?: boolean;
};

export const createSupabaseServerClient = async (
  options: SupabaseServerClientOptions = {},
): Promise<SupabaseClient<Database>> => {
  const { allowSetCookies = false } = options;
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing env variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        if (!allowSetCookies) {
          return;
        }

        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  }) as unknown as SupabaseClient<Database>;
};
