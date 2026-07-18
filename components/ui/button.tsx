import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  children: ReactNode;
};

export function Button({
  className,
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium transition-colors",
        variant === "default" &&
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90",
        variant === "outline" &&
          "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)]",
        variant === "ghost" && "bg-transparent hover:bg-[var(--color-muted)]",
        className,
      )}
      {...props}
    />
  );
}
