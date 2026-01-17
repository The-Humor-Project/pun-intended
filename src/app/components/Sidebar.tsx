"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

const DESKTOP_QUERY = "(min-width: 901px)";

const listenForMediaChange = (
  mediaQuery: MediaQueryList,
  handler: () => void,
) => {
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handler);
  } else {
    mediaQuery.addListener(handler);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handler);
    } else {
      mediaQuery.removeListener(handler);
    }
  };
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setIsOpen(mediaQuery.matches);

    apply();
    return listenForMediaChange(mediaQuery, apply);
  }, []);

  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(event.currentTarget.open);
  };

  return (
    <details className="sidebar" open={isOpen} onToggle={handleToggle}>
      <summary className="sidebar__toggle">
        <span className="sidebar__toggle-icon" aria-hidden="true" />
        <span className="sidebar__toggle-label">Menu</span>
      </summary>
      <div className="sidebar__body">
        <nav className="sidebar__nav" aria-label="Primary">
          <Link className="sidebar__link" href="/">
            Overview
          </Link>
          <Link className="sidebar__link" href="/schedule">
            Weekly Schedule
          </Link>
          <Link className="sidebar__link" href="/assignments">
            Assignments
          </Link>
        </nav>
        <div className="sidebar__spacer" aria-hidden="true" />
        <div className="sidebar__footer">
          <ThemeToggle />
        </div>
      </div>
    </details>
  );
}
