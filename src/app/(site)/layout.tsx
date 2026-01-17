import type { Metadata } from "next";

import Sidebar from "@/app/components/Sidebar";

export const metadata: Metadata = {
  title: "The Humor Project",
  description: "Spring 2026 assignments and schedule for The Humor Project.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">{children}</div>
    </div>
  );
}
