// src/lib/supabase/client.ts
// Browser-side Supabase client (singleton via module cache)
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Convenience singleton for use in hooks / client components
let _client: ReturnType<typeof createClient> | null = null;
export function getClient() {
  if (!_client) _client = createClient();
  return _client;
}
