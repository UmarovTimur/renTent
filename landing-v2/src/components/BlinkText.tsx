import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Handwritten (Caveat) label that "blinks" by hopping a soft duplicate
 * shadow around the glyphs — no opacity change on the text itself.
 * Motion is disabled under prefers-reduced-motion.
 */
export function BlinkText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("q-hand q-blink inline-block", className)}>{children}</span>;
}
