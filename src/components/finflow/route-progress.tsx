import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Slim glowing progress bar at the top of the screen during page changes. */
export function RouteProgress() {
  const loading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  const [pct, setPct] = useState(0);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      setShow(true);
      setPct(8);
      timer.current = setInterval(() => setPct((p) => (p < 90 ? p + (90 - p) * 0.12 : p)), 180);
    } else if (show) {
      if (timer.current) clearInterval(timer.current);
      setPct(100);
      const t = setTimeout(() => { setShow(false); setPct(0); }, 350);
      return () => clearTimeout(t);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div
        className="route-progress-bar h-full"
        style={{ width: `${pct}%`, opacity: show ? 1 : 0, transition: "width 200ms ease-out, opacity 300ms ease" }}
      />
    </div>
  );
}
