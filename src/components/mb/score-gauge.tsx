import { useEffect, useState } from "react";

export function ScoreGauge({ score, max = 10 }: { score: number; max?: number }) {
  const [progress, setProgress] = useState(0);
  const pct = Math.max(0, Math.min(1, score / max));

  useEffect(() => {
    const id = window.setTimeout(() => setProgress(pct), 120);
    return () => window.clearTimeout(id);
  }, [pct]);

  const size = 220;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--mb-cyan) 0%, transparent 70%)", opacity: 0.35 }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative -rotate-90">
        <defs>
          <linearGradient id="mb-gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--mb-cyan)" />
            <stop offset="50%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--mb-violet)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mb-panel-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#mb-gauge)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)", filter: "drop-shadow(0 0 10px var(--mb-cyan))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-extrabold tracking-tight text-foreground">{score.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">out of {max}</span>
      </div>
    </div>
  );
}
