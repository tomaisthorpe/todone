"use client";

import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          // Global SWR configuration
          errorRetryCount: 3,
          errorRetryInterval: 1000,
          // Only refresh when window gets focus if user was away for more than 1 minute
          focusThrottleInterval: 60000,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}