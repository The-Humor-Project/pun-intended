"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const navItems = [
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/agendas", label: "Agendas" },
  { href: "/admin/documentations", label: "Documentation" },
  { href: "/admin/semesters", label: "Semesters" },
  { href: "/admin/users", label: "Users" },
];

const isActiveLink = (pathname: string, href: string) => {
  if (pathname === href) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
};

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar__nav" aria-label="Admin">
      {navItems.map((item) => {
        const isActive = isActiveLink(pathname, item.href);

        return (
          <Link
            key={item.href}
            className={`admin-sidebar__link${isActive ? " is-active" : ""}`}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
