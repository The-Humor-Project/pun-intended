"use client";

import { useEffect, useState } from "react";

type AdminThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "admin-theme-preference";

const isAdminThemePreference = (
  value: string | null,
): value is AdminThemePreference =>
  value === "system" || value === "light" || value === "dark";

const applyAdminThemePreference = (theme: AdminThemePreference) => {
  const root = document.documentElement;
  root.setAttribute("data-admin-theme", theme);
};

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState<AdminThemePreference>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialTheme = isAdminThemePreference(stored) ? stored : "system";

    setTheme(initialTheme);
    applyAdminThemePreference(initialTheme);
  }, []);

  useEffect(() => {
    applyAdminThemePreference(theme);
  }, [theme]);

  const handleChange = (nextTheme: AdminThemePreference) => {
    if (nextTheme === theme) {
      return;
    }

    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <div className="admin-theme-toggle">
      <span className="admin-theme-toggle__label">Theme</span>
      <div className="admin-theme-toggle__options" role="group" aria-label="Theme">
        {(["system", "light", "dark"] as AdminThemePreference[]).map(
          (value) => (
            <button
              key={value}
              type="button"
              className="admin-theme-toggle__button"
              aria-pressed={theme === value}
              onClick={() => handleChange(value)}
            >
              {value}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
