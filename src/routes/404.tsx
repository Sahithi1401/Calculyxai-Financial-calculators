import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { NotFoundPage } from "@/components/finflow/not-found-page";

export const Route = createFileRoute("/404")({
  head: () =>
    pageHead({
      title: "Page Not Found (404) — Calculyx AI",
      description:
        "That page doesn't compute. Search Calculyx AI, jump to the most-used financial calculators, or head back to live markets and the AI assistant.",
      path: "/404",
      noindex: true,
    }),
  component: NotFoundPage,
});
