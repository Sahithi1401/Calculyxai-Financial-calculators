// Minimal PCM → 16-bit mono WAV encoder + mic recorder hook.
// Records via Web Audio API (safer than MediaRecorder across browsers/Safari).

import { useCallback, useRef, useState } from "react";

function encodeWav(chunks: Float32Array[], sampleRate: number): Blob {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const pcm = new Int16Array(total);
  let offset = 0;
  for (const c of chunks) {
    for (let i = 0; i < c.length; i++) {
      const s = Math.max(-1, Math.min(1, c[i]));
      pcm[offset++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }
  const buf = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(buf);
  const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, pcm.length * 2, true);
  new Int16Array(buf, 44).set(pcm);
  return new Blob([buf], { type: "audio/wav" });
}

export type MicState = "idle" | "recording" | "transcribing";

export function useMicTranscription(onText: (text: string) => void, onError: (msg: string) => void) {
  const [state, setState] = useState<MicState>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  const start = useCallback(async () => {
    if (state !== "idle") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const node = ctx.createScriptProcessor(4096, 1, 1);
      nodeRef.current = node;
      chunksRef.current = [];
      node.onaudioprocess = (e) => {
        chunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };
      source.connect(node);
      node.connect(ctx.destination);
      setState("recording");
    } catch {
      onError("Microphone access denied.");
    }
  }, [state, onError]);

  const stop = useCallback(async () => {
    if (state !== "recording") return;
    const stream = streamRef.current;
    const ctx = ctxRef.current;
    const node = nodeRef.current;
    const source = sourceRef.current;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (node) node.disconnect();
    if (source) source.disconnect();
    const sampleRate = ctx?.sampleRate ?? 44100;
    const chunks = chunksRef.current;
    if (ctx) await ctx.close();
    streamRef.current = null;
    ctxRef.current = null;
    nodeRef.current = null;
    sourceRef.current = null;
    chunksRef.current = [];

    const blob = encodeWav(chunks, sampleRate);
    if (blob.size < 2048) {
      setState("idle");
      onError("Recording was too short — please try again.");
      return;
    }
    setState("transcribing");
    try {
      const fd = new FormData();
      fd.append("file", blob, "recording.wav");
      const res = await fetch("/api/stt", { method: "POST", body: fd });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Transcription failed (${res.status})`);
      }
      const { text } = (await res.json()) as { text: string };
      if (text?.trim()) onText(text.trim());
      else onError("Nothing recognized — please try again.");
    } catch (e) {
      onError(e instanceof Error ? e.message : "Transcription failed");
    } finally {
      setState("idle");
    }
  }, [state, onText, onError]);

  const cancel = useCallback(() => {
    const stream = streamRef.current;
    const ctx = ctxRef.current;
    const node = nodeRef.current;
    const source = sourceRef.current;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (node) node.disconnect();
    if (source) source.disconnect();
    if (ctx) ctx.close();
    streamRef.current = null;
    ctxRef.current = null;
    nodeRef.current = null;
    sourceRef.current = null;
    chunksRef.current = [];
    setState("idle");
  }, []);

  return { state, start, stop, cancel };
}
