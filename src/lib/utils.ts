/**
 * Utility for merging class names. Extend with clsx/tailwind-merge if needed.
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
