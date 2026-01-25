import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (!url) {
    throw new Error(
      "Rork did not set EXPO_PUBLIC_RORK_API_BASE_URL, please use support",
    );
  }

  return url;
};

const fetchWithRetry = async (url: RequestInfo | URL, options?: RequestInit, retries = 2): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`[tRPC] Attempt ${i + 1}/${retries + 1} to:`, url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        ...options,
        credentials: 'omit',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('[tRPC] Response status:', response.status);
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`[tRPC] Attempt ${i + 1} failed:`, error);
      
      if (i < retries) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        console.log(`[tRPC] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch after retries');
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => {
        return {
          'Content-Type': 'application/json',
        };
      },
      fetch: fetchWithRetry,
    }),
  ],
});
