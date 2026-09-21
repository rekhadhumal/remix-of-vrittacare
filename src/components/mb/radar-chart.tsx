import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type Point = { label: string; value: number };

function polygon(values: number[], radius: number, cx: number, cy: number) {
  const n = values.length;
  return values
    .map((v, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + Math.cos(angle) * radius * v},${cy + Math.sin(angle) * radius * v}`;
    })
    .join(" ");
}

export function RadarChart({ data, size = 300 }: { data: Point[]; size?: number }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setGrown(true), 150);
    return () => window.clearTimeout(id);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 46;
  const values = data.map((d) => d.value);
  const shown = grown ? values : values.map(() => 0.001);

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="mx-auto max-w-[340px]">
      <defs>
        <linearGradient id="mb-radar-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--mb-cyan)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--mb-violet)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={polygon(values.map(() => ring), radius, cx, cy)}
          fill="none"
           stroke="var(--mb-line)"
        />
      ))}
      {values.map((_, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(angle) * radius}
            y2={cy + Math.sin(angle) * radius}
             stroke="var(--mb-line)"
          />
        );
      })}

      <polygon
        points={polygon(shown, radius, cx, cy)}
        fill="url(#mb-radar-fill)"
        stroke="var(--mb-cyan)"
        strokeWidth={2}
        style={{ transition: "all 1.2s cubic-bezier(0.22,1,0.36,1)", filter: "drop-shadow(0 0 8px var(--mb-cyan))" }}
      />

      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        const lx = cx + Math.cos(angle) * (radius + 26);
        const ly = cy + Math.sin(angle) * (radius + 20);
        return (
          <text
            key={d.label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[11px] font-medium"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/** Interactive pseudo-3D view: stacked radar layers you can rotate by dragging. */
export function Radar3D({ data }: { data: Point[] }) {
  const [rotY, setRotY] = useState(-28);
  const [rotX, setRotX] = useState(58);
  const [auto, setAuto] = useState(true);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setRotY((r) => r + 0.4), 40);
    return () => window.clearInterval(id);
  }, [auto]);

  const layers = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => ({
        depth: i * 26,
        scale: 1 - i * 0.06,
        color: ["var(--mb-cyan)", "var(--primary)", "var(--mb-violet)", "var(--mb-pink)"][i]!,
        opacity: 0.55 - i * 0.1,
      })),
    [],
  );

  return (
    <div
      className="relative flex h-[360px] cursor-grab select-none items-center justify-center overflow-hidden rounded-2xl bg-mb-panel-2 active:cursor-grabbing"
      style={{ perspective: "900px" }}
      onPointerDown={(e) => {
        setAuto(false);
        setDrag({ x: e.clientX, y: e.clientY });
      }}
      onPointerMove={(e) => {
        if (!drag) return;
        setRotY((r) => r + (e.clientX - drag.x) * 0.4);
        setRotX((r) => Math.max(20, Math.min(85, r - (e.clientY - drag.y) * 0.3)));
        setDrag({ x: e.clientX, y: e.clientY });
      }}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <div
        className="relative"
        style={{ transformStyle: "preserve-3d", transform: `rotateX(${rotX}deg) rotateZ(${rotY}deg)` }}
      >
        {layers.map((layer, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%,-50%) translateZ(${layer.depth}px) scale(${layer.scale})`, transformStyle: "preserve-3d" }}
          >
            <svg width={240} height={240} viewBox="0 0 240 240">
              <polygon
                points={polygon(data.map((d) => d.value), 100, 120, 120)}
                fill={layer.color}
                fillOpacity={layer.opacity}
                stroke={layer.color}
                strokeWidth={1.5}
                style={{ filter: `drop-shadow(0 0 10px ${layer.color})` }}
              />
               <polygon points={polygon(data.map(() => 1), 100, 120, 120)} fill="none" stroke="var(--mb-line)" />
            </svg>
          </div>
        ))}
      </div>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        Drag to rotate · {auto ? "auto-rotating" : "manual"}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setAuto((a) => !a)}
        className="absolute right-3 top-3 h-8 rounded-full border-mb-line bg-mb-panel px-3 text-xs text-foreground hover:border-mb-cyan/35 hover:bg-mb-panel-2"
      >
        {auto ? "Pause" : "Auto-rotate"}
      </Button>
    </div>
  );
}
