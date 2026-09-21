import { createFileRoute, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "MindBalance · Student Wellness" },
      { name: "description", content: "Understand your wellness patterns through your saved habits and assessments." },
      { property: "og:title", content: "MindBalance · Student Wellness" },
      { property: "og:description", content: "A private student wellness dashboard grounded in your own data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    throw redirect({ to: data.session ? "/dashboard" : "/auth" });
  },
  component: () => null,
});