const decodeCookieValue = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const resolveTimeZone = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const decoded = decodeCookieValue(value);

  try {
    Intl.DateTimeFormat(undefined, { timeZone: decoded });
    return decoded;
  } catch {
    return undefined;
  }
};
