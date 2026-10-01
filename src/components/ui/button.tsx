import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:scale-[1.06]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_0_0_hsl(var(--primary)/0.4)_inset,0_8px_24px_-12px_hsl(var(--primary)/0.55)] hover:bg-primary/95 hover:shadow-[0_1px_0_0_hsl(var(--primary)/0.5)_inset,0_14px_36px_-14px_hsl(var(--primary)/0.7)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-[0_10px_24px_-12px_hsl(var(--destructive)/0.6)]",
        outline:
          "border border-border/70 bg-card/40 text-foreground shadow-sm backdrop-blur-sm hover:bg-card/70 hover:border-border hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "text-foreground/80 hover:bg-card/60 hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-b from-primary to-primary/85 text-primary-foreground border border-primary/50 shadow-[0_1px_0_0_hsl(var(--primary-foreground)/0.25)_inset,0_10px_30px_-12px_hsl(var(--primary)/0.75)] hover:from-primary hover:to-primary hover:shadow-[0_1px_0_0_hsl(var(--primary-foreground)/0.3)_inset,0_16px_42px_-14px_hsl(var(--primary)/0.9)]",
        glass:
          "bg-card/50 text-foreground border border-border/60 backdrop-blur-md shadow-sm hover:bg-card/70 hover:border-border",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-7 text-[0.95rem]",
        xl: "h-12 rounded-lg px-8 text-[0.95rem]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
