"use client";

import { useAdminSession } from "@/app/admin/lib/useAdminSession";

export default function AdminHeaderSignOut() {
  const { session, signOut } = useAdminSession();

  if (!session) {
    return null;
  }

  return (
    <button className="admin-topbar__link" type="button" onClick={signOut}>
      Sign out
    </button>
  );
}
