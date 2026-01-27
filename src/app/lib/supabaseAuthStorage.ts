const INVALID_REFRESH_TOKEN_MARKERS = [
  "Invalid Refresh Token",
  "Refresh Token Not Found",
];

const MAX_COOKIE_CHUNKS = 12;

export const isInvalidRefreshTokenError = (
  error: { message?: string | null } | null | undefined,
): boolean => {
  const message = error?.message;
  if (!message) {
    return false;
  }

  return INVALID_REFRESH_TOKEN_MARKERS.some((marker) =>
    message.includes(marker),
  );
};

export const getSupabaseStorageKey = (
  supabaseUrl: string | null | undefined,
): string | null => {
  if (!supabaseUrl) {
    return null;
  }

  try {
    const host = new URL(supabaseUrl).hostname;
    const projectRef = host.split(".")[0];

    if (!projectRef) {
      return null;
    }

    return `sb-${projectRef}-auth-token`;
  } catch {
    return null;
  }
};

const buildCookieNames = (storageKey: string): string[] => {
  const names = [storageKey];

  for (let i = 0; i < MAX_COOKIE_CHUNKS; i += 1) {
    names.push(`${storageKey}.${i}`);
  }

  return names;
};

export const clearSupabaseAuthCookiesInBrowser = (
  storageKey: string | null,
): void => {
  if (!storageKey || typeof document === "undefined") {
    return;
  }

  const expires = new Date(0).toUTCString();

  buildCookieNames(storageKey).forEach((name) => {
    document.cookie = `${name}=; Path=/; Expires=${expires}; Max-Age=0; SameSite=Lax`;
  });
};

export const clearSupabaseAuthCookiesWithSetter = (
  storageKey: string | null,
  setCookie: (
    name: string,
    value: string,
    options: { path: string; maxAge: number; sameSite: "lax" },
  ) => void,
): void => {
  if (!storageKey) {
    return;
  }

  const options = { path: "/", maxAge: 0, sameSite: "lax" as const };

  buildCookieNames(storageKey).forEach((name) => {
    setCookie(name, "", options);
  });
};

