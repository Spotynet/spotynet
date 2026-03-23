import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-[var(--background)] hover:bg-white hover:shadow-[0_0_20px_rgba(240,240,248,0.25)]",
  secondary:
    "rounded-lg bg-[var(--muted)] px-5 py-2.5 text-[var(--foreground)] border border-[var(--card-border)] hover:border-[var(--card-border-hover)] hover:shadow-[0_0_16px_rgba(0,200,188,0.1)]",
  outline:
    "rounded-lg border border-[var(--foreground)]/25 px-5 py-2.5 text-[var(--foreground)] hover:border-[var(--foreground)]/50 hover:bg-[var(--foreground)]/5",
  ghost:
    "px-0 py-1 text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  children,
  className,
  href,
  ...props
}: ButtonProps & { href?: string }) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
