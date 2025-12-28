import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Humor Project",
  description: "Spring 2026 assignments and schedule for The Humor Project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}>
        <div className="app-shell">
          <details className="sidebar" open>
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
              </nav>
              <div className="sidebar__spacer" aria-hidden="true" />
              <div className="sidebar__footer">
                <ThemeToggle />
              </div>
            </div>
          </details>
          <div className="app-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
