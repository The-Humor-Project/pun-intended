"use client";

import { useEffect } from "react";

export default function AdminUiScope() {
  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-admin-ui", "true");

    return () => {
      body.removeAttribute("data-admin-ui");
    };
  }, []);

  return null;
}
