// src/lib/supabase/index.ts
// Convenience barrel — import everything from "@/lib/supabase"
export { createClient, getClient } from "./client";
export { createServerSupabaseClient } from "./server";
export * from "./db";
