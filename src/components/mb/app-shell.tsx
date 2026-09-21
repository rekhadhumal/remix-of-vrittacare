import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  ClipboardList,
  Home,
  Info,
  LineChart,
  LogOut,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import quoteArt from "@/assets/quote-art.jpg";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/assessment", label: "Take Assessment", icon: ClipboardList },
  { to: "/results", label: "My Results", icon: LineChart },
  { to: "/insights", label: "Insights & Tips", icon: Sparkles },
  { to: "/chat", label: "Chat with Assistant", icon: MessageCircle },
  { to: "/about", label: "About Project", icon: Info },
] as const;

export function AppShell({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mb-theme min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <aside className="sticky top-0 hidden h-screen w-[196px] shrink-0 flex-col justify-between border-r border-mb-line bg-mb-sidebar px-3.5 py-5 lg:flex">
          <div>
            <div className="flex items-center gap-2.5 px-1">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-mb-cyan/25 bg-mb-cyan/10 text-mb-cyan shadow-[0_0_28px_-10px_var(--mb-cyan)]">
                <Brain className="h-5 w-5" />
              </span>
              <div>
                <p className="bg-gradient-to-r from-mb-cyan to-primary bg-clip-text text-[15px] font-extrabold leading-tight text-transparent">MindBalance</p>
                <p className="max-w-[132px] text-[9px] leading-tight text-muted-foreground">
                  Mental Health Prediction System
                </p>
              </div>
            </div>

            <nav className="mt-8 space-y-1">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-mb-cyan/20 to-primary/8 text-mb-cyan shadow-[inset_0_0_0_1px_var(--mb-line),0_8px_24px_-18px_var(--mb-cyan)]"
                        : "text-muted-foreground hover:translate-x-0.5 hover:bg-mb-panel-2/60 hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-mb-line">
              <img src={quoteArt} alt="Calm scenic artwork" loading="lazy" className="h-36 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-mb-sidebar via-mb-sidebar/20 to-transparent" />
              <p className="absolute inset-x-3 bottom-3 font-hand text-lg font-semibold leading-tight text-foreground">
                “Every day is a fresh start.”
              </p>
            </div>
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full justify-start gap-2 px-3 text-sm text-muted-foreground hover:bg-mb-panel-2/60 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-3 pb-20 sm:p-5 lg:pb-5 xl:p-5 2xl:p-6">
          <div className="mx-auto max-w-[1140px] space-y-4">{children}</div>
        </main>

        {aside ? (
          <aside className="sticky top-0 hidden h-screen w-[310px] shrink-0 border-l border-mb-line bg-mb-sidebar p-4 2xl:w-[350px] xl:block">
            {aside}
          </aside>
        ) : null}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-mb-line bg-mb-sidebar/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px]",
              pathname === item.to ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
