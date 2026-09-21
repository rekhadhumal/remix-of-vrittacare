import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import authLandscape from "@/assets/vrittacare-auth-landscape.jpg";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in · VRITTACARE" },
      { name: "description", content: "Sign in to VRITTACARE, your student's mental wellness companion." },
      { property: "og:title", content: "Sign in · VRITTACARE" },
      { property: "og:description", content: "Student's Mental Wellness Companion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        if (error) throw error;
        if (!data.session) setCheckEmail(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (!result.redirected) navigate({ to: "/dashboard", replace: true });
  }

  function changeMode(next: "signin" | "signup") {
    setMode(next);
    setCheckEmail(false);
  }

  return (
    <main className="auth-reference mb-theme relative isolate min-h-screen overflow-x-hidden bg-background text-foreground">
      <img
        src={authLandscape}
        alt="Two students overlooking a mountain lake beneath a luminous night sky"
        width={1536}
        height={1024}
        className="auth-reference-image absolute inset-0 h-full w-full object-cover"
      />
      <div className="auth-reference-overlay absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1480px] items-center gap-8 px-5 py-8 sm:px-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)] lg:gap-14 lg:px-14 xl:px-20">
        <section className="auth-brand-lockup self-start pt-1 text-center sm:pt-5 lg:self-stretch lg:pt-[7vh]" aria-label="VRITTACARE">
          <BrandMark />
          <p className="mt-4 text-[27px] font-extrabold leading-none tracking-[0.18em] text-foreground drop-shadow-[0_0_18px_var(--auth-cyan-glow)] sm:text-[34px]">
            VRITTA<span className="text-mb-cyan">CARE</span>
          </p>
          <p className="mt-2 text-[13px] font-semibold text-foreground/95 drop-shadow-md sm:text-[16px]">
            Student&apos;s Mental Wellness Companion
          </p>
        </section>

        <section className="auth-reference-card w-full max-w-[540px] justify-self-end rounded-[22px] border border-auth-bright-line px-5 py-7 shadow-auth-card backdrop-blur-xl sm:px-9 sm:py-9 lg:px-10" aria-label={mode === "signin" ? "Sign in" : "Create account"}>
          <header className="text-center">
            <h1 className="text-[27px] font-bold leading-tight sm:text-[31px]">
              {mode === "signin" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="mt-2 text-sm text-foreground/68">
              {mode === "signin" ? "Take a step towards a healthier you" : "Begin your journey towards a healthier you"}
            </p>
          </header>

          <div className="mt-7 grid h-11 grid-cols-2 rounded-xl border border-auth-line bg-auth-tab p-0.5" aria-label="Authentication mode">
            <Button type="button" variant="ghost" onClick={() => changeMode("signin")} className={`h-full rounded-[10px] text-sm font-medium hover:bg-transparent ${mode === "signin" ? "auth-active-tab text-foreground" : "text-foreground/65"}`}>
              Sign In
            </Button>
            <Button type="button" variant="ghost" onClick={() => changeMode("signup")} className={`h-full rounded-[10px] text-sm font-medium hover:bg-transparent ${mode === "signup" ? "auth-active-tab text-foreground" : "text-foreground/65"}`}>
              Create Account
            </Button>
          </div>

          {checkEmail ? (
            <div className="mt-7 rounded-xl border border-mb-cyan/30 bg-mb-cyan/8 p-6 text-sm">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-mb-cyan/12 text-mb-cyan"><Mail className="h-5 w-5" /></span>
              <p className="font-semibold">Check your email</p>
              <p className="mt-2 leading-6 text-foreground/65">We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Open it to activate your account.</p>
            </div>
          ) : (
            <>
              <form onSubmit={submit} className="mt-7 space-y-5">
                {mode === "signup" ? <Field label="Full Name" value={name} onChange={setName} type="text" placeholder="Enter your name" icon="user" autoComplete="name" required /> : null}
                <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="Enter your email" icon="email" autoComplete="email" required />
                <Field label="Password" value={password} onChange={setPassword} type={showPassword ? "text" : "password"} placeholder="Enter your password" icon="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required trailing={
                  <Button type="button" variant="ghost" size="icon-sm" className="text-foreground/80 hover:bg-mb-cyan/8 hover:text-foreground" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                } />

                {mode === "signin" ? (
                  <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <label className="flex cursor-pointer items-center gap-2.5 text-foreground/65">
                      <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="auth-checkbox h-4 w-4 appearance-none rounded-[4px] border border-mb-cyan/55" />
                      Remember me
                    </label>
                    <span className="text-mb-cyan">Forgot password?</span>
                  </div>
                ) : null}

                <Button type="submit" disabled={busy} className="auth-submit group h-12 w-full rounded-[10px] text-sm font-semibold text-foreground shadow-auth-action transition duration-300 hover:shadow-auth-action-hover">
                  {busy ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />Please wait…</span> : <>{mode === "signin" ? "Sign In" : "Create Account"}<ArrowRight className="transition-transform group-hover:translate-x-0.5" /></>}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-4 text-xs text-foreground/65"><span className="h-px flex-1 bg-auth-line" /><span>OR</span><span className="h-px flex-1 bg-auth-line" /></div>

              <Button type="button" variant="outline" onClick={google} className="h-12 w-full rounded-[10px] border-auth-line bg-auth-tab font-medium text-foreground shadow-none hover:border-mb-cyan/40 hover:bg-auth-field">
                <GoogleMark /> Continue with Google
              </Button>

              <p className="mt-6 text-center text-xs text-foreground/65 sm:text-sm">
                {mode === "signin" ? "Don’t have an account?" : "Already have an account?"}{" "}
                <Button type="button" variant="link" onClick={() => changeMode(mode === "signin" ? "signup" : "signin")} className="h-auto p-0 font-semibold text-mb-cyan no-underline">
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </Button>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark relative mx-auto block h-16 w-[92px] text-mb-cyan sm:h-[74px] sm:w-[106px]" aria-hidden="true">
      <Brain className="absolute left-1 top-0 h-16 w-16 stroke-[1.7] drop-shadow-[0_0_7px_var(--auth-cyan-glow)] sm:h-[72px] sm:w-[72px]" />
      <Leaf className="absolute bottom-0 right-0 h-11 w-11 rotate-[-16deg] stroke-[1.8] text-mb-green drop-shadow-[0_0_7px_var(--auth-teal-glow)] sm:h-12 sm:w-12" />
      <span className="absolute bottom-1 left-[52px] h-8 w-px -rotate-[28deg] bg-mb-cyan shadow-auth-mark sm:left-[59px]" />
    </span>
  );
}

function GoogleMark() {
  return <span className="google-mark grid h-6 w-6 place-items-center rounded-full bg-foreground text-[15px] font-extrabold" aria-hidden="true">G</span>;
}

function Field({ label, value, onChange, type, placeholder, required, icon, autoComplete, trailing }: { label: string; value: string; onChange: (value: string) => void; type: string; placeholder?: string; required?: boolean; icon: "email" | "password" | "user"; autoComplete: string; trailing?: React.ReactNode }) {
  const Icon = icon === "email" ? Mail : icon === "password" ? LockKeyhole : UserRound;
  return (
    <label className="relative block rounded-xl border border-auth-bright-line bg-auth-field px-4 pb-1 pt-3 transition duration-200 focus-within:border-mb-cyan/65 focus-within:ring-2 focus-within:ring-mb-cyan/10">
      <span className="absolute -top-2.5 left-8 bg-auth-label px-2 text-[12px] font-medium text-foreground">{label}</span>
      <span className="flex h-10 items-center gap-4">
        <Icon className="h-5 w-5 shrink-0 text-foreground/90" />
        <input type={type} value={value} required={required} placeholder={placeholder} autoComplete={autoComplete} aria-label={label} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/52" />
        {trailing}
      </span>
    </label>
  );
}