import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
<div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      // theme-aware surface: uses semantic tokens so it adapts to light/dark
      "border border-border/60 bg-card/60 backdrop-blur-xl",
      "shadow-[0_1px_0_0_hsl(0_0%_100%/0.04)_inset,0_20px_60px_-30px_hsl(var(--foreground)/0.15)]",
      "transform-gpu transition-all duration-300 hover:border-primary/40 hover:bg-card/80",
      className,
    )}
    {...props}
  >
    <div className="pointer-events-none absolute inset-0 opacity-60">{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-10 w-10 origin-left transform-gpu text-primary transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="font-display text-xl font-semibold tracking-tight text-card-foreground">
        {name}
      </h3>
      <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <Link to={href as never}>
          {cta}
          <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
        </Link>
      </Button>

    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu bg-primary/[0.04] opacity-0 transition-all duration-300 group-hover:opacity-100" />
  </div>
);

export { BentoCard, BentoGrid };
