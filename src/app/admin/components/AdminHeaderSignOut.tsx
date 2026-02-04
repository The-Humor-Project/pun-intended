"use client";

import {useAdminSession} from "@/app/admin/lib/useAdminSession";

export default function AdminHeaderSignOut() {
  const { session, signOut } = useAdminSession();

  if (!session) {
    return null;
  }

  return (
    <button
      className="admin-sidebar__link admin-sidebar__action"
      type="button"
      onClick={signOut}
    >
      Sign out
    </button>
  );
}
