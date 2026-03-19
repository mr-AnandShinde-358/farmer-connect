// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // State time:5 minute - data stays fresh before refetching

      staleTime: 5 * 60 * 1000,

      //Catch time : 10 minutes - data kept in cache after unused

      gcTime: 10 * 60 * 1000,

      // retry failed requests twice (skip 401 - handle by axios interceptor)

      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        if (error?.response?.status === 403) return false;
        if (error?.response?.status === 404) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});


// Query keys Factory - centralized, type safe
