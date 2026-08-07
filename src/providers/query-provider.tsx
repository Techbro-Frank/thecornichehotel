/**
 * @file QueryProvider — React Query (TanStack) client wrapper
 * @description Provides a QueryClient to the entire app. Configured with 60s stale time
 *   and disabled refetch-on-focus to reduce unnecessary re-fetches. The QueryClient is
 *   created via useState to ensure a single instance per component lifecycle.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/** React Query provider — wraps children with a configured QueryClient. */
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
