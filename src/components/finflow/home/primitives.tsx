import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Marquee ---------- */
export function Marquee({ children, speed = 40, className = "", pauseOnHover = true }: { children: ReactNode; speed?: number; className?: string; pauseOnHover?: boolean }) {
  return (
    <div className={cn("group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]", className)}>
      <div
        className={cn("flex shrink-0 items-center gap-8 pr-8 animate-[marquee_var(--d)_linear_infinite]", pauseOnHover && "group-hover:[animation-play-state:paused]")}
        style={{ ["--d" as never]: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn("flex shrink-0 items-center gap-8 pr-8 animate-[marquee_var(--d)_linear_infinite]", pauseOnHover && "group-hover:[animation-play-state:paused]")}
        style={{ ["--d" as never]: `${speed}s` }}
      >
        {children}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-100%); } }`}</style>
    </div>
  );
}

/* ---------- Animated counter (reveals on scroll) ---------- */
export function AnimatedCounter({ value, duration = 1600, suffix = "", prefix = "", className = "" }: { value: number; duration?: number; suffix?: string; prefix?: string; className?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(value * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref} className={className}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({ children, delay = 0, className = "", y = 20 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((es) => es[0].isIntersecting && setShow(true), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : `translateY(${y}px)`,
        filter: show ? "blur(0)" : "blur(6px)",
        transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, filter .8s ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Magnetic button ---------- */
export function MagneticButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handle = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate3d(0,0,0)"; };
  return (
    <button ref={ref} onMouseMove={handle} onMouseLeave={reset} className={cn("transition-transform duration-200 ease-out", className)} {...props}>
      {children}
    </button>
  );
}
