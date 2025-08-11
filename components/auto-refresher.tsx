"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresher({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const openDialog = document.querySelector('[data-slot="dialog-content"][data-state="open"]');
      if (!openDialog) {
        router.refresh();
      }
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [router, intervalMs]);

  useEffect(() => {
    const refreshIfVisible = () => {
      // Skip if any dialog is open to avoid wiping unsaved changes
      const openDialog = document.querySelector('[data-slot="dialog-content"][data-state="open"]');
      if (document.visibilityState === "visible" && !openDialog) {
        router.refresh();
      }
    };

    window.addEventListener("focus", refreshIfVisible);
    document.addEventListener("visibilitychange", refreshIfVisible);
    window.addEventListener("pageshow", refreshIfVisible);

    return () => {
      window.removeEventListener("focus", refreshIfVisible);
      document.removeEventListener("visibilitychange", refreshIfVisible);
      window.removeEventListener("pageshow", refreshIfVisible);
    };
  }, [router]);

  return null;
}