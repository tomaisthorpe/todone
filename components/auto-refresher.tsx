"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresher({ intervalMs = 10000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [router, intervalMs]);

  return null;
}