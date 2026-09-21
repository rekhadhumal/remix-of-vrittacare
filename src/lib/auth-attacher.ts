import { createMiddleware } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side middleware that attaches the Supabase bearer token to every
 * server-function call so `requireSupabaseAuth` can validate the caller.
 */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (typeof window === "undefined") return next();

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return next();

    return next({ headers: { Authorization: `Bearer ${token}` } });
  },
);
