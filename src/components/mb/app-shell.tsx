import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Home, Info, LineChart, LogOut, MessageCircle, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { BrandLockup } from "@/components/mb/brand-mark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssistantPanel } from "@/components/mb/assistant-panel";
import botAvatar from "@/assets/bot-avatar.png";
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
  const [assistantOpen, setAssistantOpen] = useState(false);
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
              <BrandLockup compact className="px-1" />
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
            <div className="px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">Dreamed into reality by</p>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-foreground/90">Rutuja Dhumal</p>
              <p className="text-[11px] font-medium leading-4 text-muted-foreground">&amp;</p>
              <p className="text-[12px] font-semibold leading-5 text-foreground/90">Vaibhav Solanke</p>
            </div>

            <Button onClick={signOut} variant="ghost" className="w-full justify-start gap-2 px-3 text-sm text-muted-foreground hover:bg-white/[0.045] hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-3 pb-20 sm:p-5 lg:pb-5 xl:p-6 2xl:p-7">
          <div className="mb-4 flex items-center border-b border-white/10 pb-3 lg:hidden">
            <BrandLockup compact />
          </div>
          <div className="mx-auto max-w-[1180px] space-y-5">{children}</div>
        </main>

        {aside ? (
          <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 border-l border-white/10 bg-[#020817]/55 p-4 backdrop-blur-2xl 2xl:w-[350px] xl:block">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-xl">{aside}</div>
          </aside>
        ) : null}
      </div>

      {pathname !== "/chat" ? (
        <>
          <button
            type="button"
            onClick={() => setAssistantOpen(true)}
            aria-label="Open Wellness Assistant"
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-full border border-mb-cyan/25 bg-[#071a31]/90 px-3 py-2 shadow-[0_18px_45px_-18px_rgba(34,211,238,.7)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-mb-cyan/50 hover:bg-[#0a223d] sm:bottom-7 sm:right-7"
          >
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-mb-cyan/35 bg-mb-panel-2">
              <img src={botAvatar} alt="" className="h-full w-full object-contain" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#071a31] bg-mb-green" />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-mb-cyan">Wellness Assistant</span>
              <span className="block text-[11px] font-medium text-white/80">Hi, I’m here if you need me</span>
            </span>
          </button>

          <Dialog open={assistantOpen} onOpenChange={setAssistantOpen}>
            <DialogContent className="mb-theme max-w-md border-white/15 bg-mb-panel/95 p-0 text-foreground shadow-[0_30px_90px_-35px_rgba(34,211,238,.45)] backdrop-blur-2xl sm:max-w-lg">
              <DialogHeader className="sr-only">
                <DialogTitle>Wellness Assistant</DialogTitle>
              </DialogHeader>
              <div className="h-[min(720px,82vh)] p-4 sm:p-5">
                <AssistantPanel />
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : null}

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
