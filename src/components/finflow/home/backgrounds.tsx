import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ---------- Aurora: soft slow drifting blobs, theme adaptive ---------- */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-40 -left-24 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[110px] opacity-70 dark:opacity-40 animate-[agFloat1_22s_ease-in-out_infinite]" />
      <div className="absolute top-10 right-[-8rem] h-[30rem] w-[30rem] rounded-full blur-[110px] opacity-70 dark:opacity-35 animate-[agFloat2_28s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.15 200 / 0.55), transparent 70%)" }} />
      <div className="absolute bottom-[-10rem] left-1/3 h-[34rem] w-[34rem] rounded-full blur-[110px] opacity-60 dark:opacity-40 animate-[agFloat3_32s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.2 300 / 0.5), transparent 70%)" }} />
    </div>
  );
}

/* ---------- Blueprint grid with radial mask ---------- */
export function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(oklch(from var(--foreground) l c h / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(from var(--foreground) l c h / 0.06) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)",
      }}
    />
  );
}

/* ---------- Mesh orbs with mouse parallax ---------- */
export function MeshOrbs({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const handle = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.setProperty("--mx", String(x));
      el.style.setProperty("--my", String(y));
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden [--mx:0] [--my:0]", className)}>
      <div className="absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-primary/25 blur-3xl" style={{ transform: "translate3d(calc(var(--mx)*30px), calc(var(--my)*30px), 0)" }} />
      <div className="absolute right-[8%] top-[40%] h-72 w-72 rounded-full blur-3xl" style={{ background: "oklch(0.82 0.13 82 / 0.28)", transform: "translate3d(calc(var(--mx)*-40px), calc(var(--my)*-20px), 0)" }} />
      <div className="absolute left-[35%] bottom-[10%] h-80 w-80 rounded-full bg-primary/20 blur-3xl" style={{ transform: "translate3d(calc(var(--mx)*20px), calc(var(--my)*-40px), 0)" }} />
    </div>
  );
}

/* ---------- Particle canvas: dot-network with connecting lines ---------- */
export function ParticleField({ density = 40, className = "" }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: density }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const color = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "0 0% 100%";
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      // lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `oklch(${color} / ${(1 - d / 130) * 0.14})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // dots
      for (const p of pts) {
        ctx.fillStyle = `oklch(${color} / 0.35)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density]);
  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
