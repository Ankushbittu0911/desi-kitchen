"use client";
// src/hooks/useAdminAuth.ts
// Supabase-backed admin guard. Redirects to /admin/login if unauthenticated
// or if the logged-in user is not in the admin_users table.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getClient } from "@/lib/supabase/client";

export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getClient();

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
        setLoading(false);
        return;
      }

      // Confirm user is in admin_users table
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!adminRow) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        setLoading(false);
        return;
      }

      setUser(session.user);
      setLoading(false);
    });

    // Live auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setUser(null);
          router.replace("/admin/login");
          return;
        }
        setUser(session.user);
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return { user, loading };
}
