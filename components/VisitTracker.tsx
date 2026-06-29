"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const cleSession = `visite:${pathname}`;
    if (sessionStorage.getItem(cleSession)) return;
    sessionStorage.setItem(cleSession, "1");

    void import("@/lib/supabase").then(({ supabase }) => {
      void supabase.from("visites").insert({
        page: pathname,
        user_agent: navigator.userAgent,
      });
    });
  }, [pathname]);

  return null;
}
