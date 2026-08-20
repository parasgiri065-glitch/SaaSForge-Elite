import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const buttonVariants: Record<Variant, string> = {
  primary: "bg-violet-500 text-white hover:bg-violet-400 disabled:bg-violet-500/50",
  secondary: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
  ghost: "text-white/70 hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-600/50",
};

const buttonSizes: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3.5 text-sm",
  lg: "h-11 px-4 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/**
 * Native button with semantic variants. No third-party UI kit.
 *
 * @param props.variant - Visual variant (`primary` default).
 * @param props.size - Control size (`md` default).
 * @param props.children - Button label / icons.
 * @returns A `<button>` element.
 */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
