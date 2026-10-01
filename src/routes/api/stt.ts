import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("STT not configured", { status: 500 });

        const inbound = await request.formData();
        const file = inbound.get("file") as Blob | null;
        if (!file || typeof (file as Blob).size !== "number") {
          return new Response("Missing audio file", { status: 400 });
        }
        if (file.size < 2048) {
          return new Response("Recording too short — please try again.", { status: 400 });
        }

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, "recording.wav");

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: upstream,
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          return new Response(t || `Transcription failed (${res.status})`, { status: res.status });
        }

        const data = (await res.json()) as { text?: string };
        return new Response(JSON.stringify({ text: data.text ?? "" }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
