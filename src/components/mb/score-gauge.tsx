import { useEffect, useState } from "react";

function scoreLabel(score: number) {
  if (score >= 8) return "Thriving";
  if (score >= 6.5) return "Stable";
  if (score >= 5) return "Mixed";
  return "Needs Care";
}

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
  const label = scoreLabel(score);

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute h-48 w-48 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--mb-cyan) 0%, var(--mb-violet) 38%, transparent 70%)", opacity: 0.28 }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <defs>
          <linearGradient id="mb-gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--mb-cyan)" />
            <stop offset="55%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--mb-violet)" />
          </linearGradient>
          <linearGradient id="mb-gauge-track" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--mb-cyan)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--mb-violet)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#mb-gauge-track)" strokeWidth={stroke} />
        {[0, 2, 4, 6, 8, 10].map((tick) => {
          const angle = (tick / max) * Math.PI * 2 - Math.PI / 2;
          const outer = r + 12;
          const inner = r + 5;
          return (
            <line
              key={tick}
              x1={size / 2 + Math.cos(angle) * inner}
              y1={size / 2 + Math.sin(angle) * inner}
              x2={size / 2 + Math.cos(angle) * outer}
              y2={size / 2 + Math.sin(angle) * outer}
              stroke="var(--mb-line)"
              strokeWidth={tick === 0 || tick === 10 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
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
          pathLength={1}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)", filter: "drop-shadow(0 0 10px var(--mb-cyan))" }}
        />
        <circle
          cx={size / 2 + Math.cos((progress * Math.PI * 2) - Math.PI / 2) * r}
          cy={size / 2 + Math.sin((progress * Math.PI * 2) - Math.PI / 2) * r}
          r="5"
          fill="var(--mb-cyan)"
          stroke="var(--mb-panel-2)"
          strokeWidth="3"
          style={{ transition: "cx 1.4s cubic-bezier(0.22,1,0.36,1), cy 1.4s cubic-bezier(0.22,1,0.36,1)", filter: "drop-shadow(0 0 9px var(--mb-cyan))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mb-cyan">Wellness score</span>
        <span className="mt-1 text-5xl font-extrabold tracking-tight text-foreground">{score.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">out of {max}</span>
        <span className="mt-2 rounded-full border border-mb-cyan/20 bg-mb-cyan/10 px-2.5 py-1 text-[10px] font-bold text-mb-cyan">{label}</span>
      </div>
    </div>
  );
}
