import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { StatusShell, StatusButton } from "@/components/finflow/status-shell";

export const Route = createFileRoute("/offline")({
  component: OfflinePage,
  head: () => ({
    meta: [
      { title: "You're offline — Calculyx AI" },
      { name: "description", content: "You appear to be offline. Reconnect to continue using Calculyx AI." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function OfflinePage() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <StatusShell
      kicker={online ? "Connection restored" : "You're offline"}
      title={online ? "You're back online." : "No internet connection."}
      description={
        online
          ? "Great — your connection is back. Reload to fetch the freshest market data."
          : "Live prices, AI insights and account data need an active connection. Reconnect and we'll retry automatically."
      }
      icon={<WifiOff className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />}
      actions={
        <>
          <StatusButton onClick={() => location.reload()}>Retry connection</StatusButton>
          <StatusButton to="/" variant="ghost">Go home</StatusButton>
        </>
      }
    />
  );
}
