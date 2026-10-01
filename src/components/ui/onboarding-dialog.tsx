"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FinFlowLogo } from "@/components/finflow/logo";

const STEPS = [
  {
    title: "Welcome to Calculyx AI",
    description:
      "Your AI-powered financial command center. Currency, loans, tax, investing — one place, live data.",
  },
  {
    title: "15 unified calculators",
    description:
      "SIP, EMI, FD, CAGR, Retirement, Tax and more — each ships with AI narrative and country-aware assumptions.",
  },
  {
    title: "Live Stock Hub",
    description:
      "Top 50 NSE + US tickers with bull/bear cases, health scores, analyst ratings and one-click PDF & Excel exports.",
  },
  {
    title: "Ready to build wealth?",
    description:
      "Sign in to save calculations, sync across devices, and chat with the AI assistant.",
  },
];

export function OnboardingDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const total = STEPS.length;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="rounded-full">
            Take the tour
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-md [&>button:last-child]:text-white">
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/70 to-accent" />
          <div className="absolute inset-0 grid place-items-center">
            <FinFlowLogo className="h-10 w-auto text-white" />
          </div>
        </div>

        <div className="space-y-6 px-6 pb-6 pt-5">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {STEPS[step - 1].title}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {STEPS[step - 1].description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row items-center justify-between gap-4 sm:justify-between">
            <div className="flex gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i + 1 === step ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  Skip
                </Button>
              </DialogClose>
              {step < total ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>
                  Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button size="sm">Okay</Button>
                </DialogClose>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
