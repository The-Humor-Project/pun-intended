"use client";

import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "theme-preference";

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

const applyThemePreference = (theme: ThemePreference) => {
  const root = document.documentElement;

  if (theme === "system") {
    root.removeAttribute("data-theme");
    return;
  }

  root.setAttribute("data-theme", theme);
};

const listenForSystemThemeChanges = (handler: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => handler();

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", listener);
  } else {
    mediaQuery.addListener(listener);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", listener);
    } else {
      mediaQuery.removeListener(listener);
    }
  };
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialTheme = isThemePreference(stored) ? stored : "system";

    setTheme(initialTheme);
    applyThemePreference(initialTheme);
  }, []);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    return listenForSystemThemeChanges(() => applyThemePreference("system"));
  }, [theme]);

  const handleChange = (nextTheme: ThemePreference) => {
    if (nextTheme === theme) {
      return;
    }

    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyThemePreference(nextTheme);
  };

  return (
    <div className="theme-toggle">
      <span className="theme-toggle__label">Theme</span>
      <div className="theme-toggle__buttons" role="group" aria-label="Theme">
        {(["system", "light", "dark"] as ThemePreference[]).map((value) => {
          const icon =
            value === "system" ? (
              <svg
                className="theme-toggle__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="12"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 20h8M12 16v4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            ) : value === "light" ? (
              <svg
                className="theme-toggle__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg
                className="theme-toggle__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M21 12.8A7 7 0 1 1 11.2 3a6 6 0 0 0 9.8 9.8z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            );

          return (
            <button
              key={value}
              type="button"
              className="theme-toggle__button"
              aria-pressed={theme === value}
              aria-label={value}
              title={value}
              onClick={() => handleChange(value)}
            >
              {icon}
              <span className="sr-only">{value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
