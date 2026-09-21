import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Brain, ClipboardList, Home, Info, LineChart, LogOut, MessageCircle, Sparkles } from "lucide-react";
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
    <div className="mb-theme relative min-h-screen overflow-hidden bg-[#020817] font-sans text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.14),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(124,58,237,.13),transparent_25%),linear-gradient(135deg,#020817_0%,#071a31_48%,#020817_100%)]" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-mb-cyan/8 blur-[110px] animate-pulse" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-mb-violet/8 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-mb-cyan/5 blur-[100px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col justify-between border-r border-white/10 bg-[#020817]/65 px-3.5 py-5 backdrop-blur-2xl lg:flex">
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_20px_60px_-40px_rgba(34,211,238,.5)] backdrop-blur-xl">
              <div className="flex items-center gap-2.5 px-1">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-mb-cyan/25 bg-mb-cyan/10 text-mb-cyan shadow-[0_0_28px_-10px_var(--mb-cyan)]">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <p className="bg-gradient-to-r from-mb-cyan to-primary bg-clip-text text-[15px] font-extrabold leading-tight text-transparent">VRITTACARE</p>
                  <p className="max-w-[145px] text-[9px] leading-tight text-muted-foreground">Mental Health Prediction System</p>
                </div>
              </div>
            </div>

            <nav className="mt-7 space-y-1.5">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-[12px] font-medium transition-all duration-300",
                      active
                        ? "bg-gradient-to-r from-mb-cyan/20 via-primary/10 to-transparent text-mb-cyan shadow-[inset_0_0_0_1px_rgba(255,255,255,.08),0_12px_30px_-22px_var(--mb-cyan)]"
                        : "text-muted-foreground hover:translate-x-1 hover:bg-white/[0.045] hover:text-foreground",
                    )}
                  >
                    {active ? <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-mb-cyan shadow-[0_0_12px_var(--mb-cyan)]" /> : null}
                    <item.icon className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", active && "text-mb-cyan")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="group relative overflow-hidden rounded-2xl border border-mb-cyan/15 bg-gradient-to-br from-mb-cyan/[0.08] via-white/[0.035] to-mb-violet/[0.08] p-3.5 backdrop-blur-xl shadow-[0_24px_70px_-50px_rgba(34,211,238,.8)]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-mb-cyan/15 blur-2xl transition duration-700 group-hover:bg-mb-cyan/25" />
              <div className="relative rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-mb-cyan/20 bg-mb-cyan/10 text-mb-cyan">✦</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-mb-cyan">A thought to carry</span>
                </div>
                <p className="font-serif text-sm font-semibold italic leading-relaxed text-white/90">
                  “You are not behind. Keep walking — even a quiet step can change the direction of a life.”
                </p>
              </div>
              <div className="relative mt-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Dreamed into reality by</p>
                <p className="mt-1 text-[11px] font-bold text-foreground/90">Vaibhav Solanke</p>
                <p className="text-[9px] text-mb-cyan">&</p>
                <p className="text-[11px] font-bold text-foreground/90">Rutuja Dhumal</p>
              </div>
            </div>

            <Button onClick={signOut} variant="ghost" className="w-full justify-start gap-2 px-3 text-sm text-muted-foreground hover:bg-white/[0.045] hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-3 pb-20 sm:p-5 lg:pb-5 xl:p-6 2xl:p-7">
          <div className="mx-auto max-w-[1180px] space-y-5">{children}</div>
        </main>

        {aside ? (
          <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 border-l border-white/10 bg-[#020817]/55 p-4 backdrop-blur-2xl 2xl:w-[350px] xl:block">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-xl">{aside}</div>
          </aside>
        ) : null}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/10 bg-[#020817]/90 px-2 py-2 backdrop-blur-2xl lg:hidden">
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px]", pathname === item.to ? "text-mb-cyan" : "text-muted-foreground")}>
            <item.icon className="h-4 w-4" />
            {item.label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
