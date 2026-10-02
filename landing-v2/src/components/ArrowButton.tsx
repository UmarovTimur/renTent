import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrowButtonProps {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  /** dark = charcoal pill on light bg · light = cream pill on dark bg */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Pill button matching the source's hover choreography: on hover the pill
 * contracts from the right (animating its width), and a circle the height of
 * the button pops in at the right with a small gap, its arrow sliding in from
 * the left. Timings/easing mirror the original (.button-inner / .button-circle
 * / .button-arrow).
 */
export function ArrowButton({
  children,
  href,
  target,
  rel,
  onClick,
  variant = "dark",
  className,
}: ArrowButtonProps) {
  const colors =
    variant === "dark" ? "bg-charcoal text-cream" : "bg-cream text-charcoal";

  const inner = (
    <>
      {/* Sizer sets the button's natural width. Its side padding = the normal
          padding (2rem each) PLUS the shrink room (3.9rem = circle + gap, split
          across both sides = 1.95rem each). On hover the pill contracts by
          exactly the shrink room and still keeps ~2rem of padding, so it can
          never become narrower than the text inside. Below md (touch, no
          hover) the shrink room is dropped so long labels fit a phone. */}
      <span
        aria-hidden
        className="pointer-events-none invisible whitespace-nowrap px-8 font-display md:px-[3.95rem]"
      >
        {children}
      </span>

      {/* pill — contracts from the right on hover (text stays centred, never clipped) */}
      <span
        className={cn(
          "button-inner absolute inset-0 flex w-full items-center justify-center whitespace-nowrap rounded-full px-4 font-display transition-[width] delay-[25ms] duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-[calc(100%-3.9rem)]",
          colors,
        )}
      >
        {children}
      </span>

      {/* circle — pops in at the right, height of the button */}
      <span
        className={cn(
          "button-circle absolute right-0 top-0 flex aspect-square h-full origin-center scale-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100",
          colors,
        )}
      >
        <ArrowRight
          strokeWidth={2.25}
          className="h-[38%] w-[38%] -translate-x-[160%] transition-transform delay-150 duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0"
        />
      </span>
    </>
  );

  // Dark pills count as dark ground for the header logo passing over them
  const theme = variant === "dark" ? "dark" : undefined;

  const classes = cn(
    "button group relative inline-flex h-[3.4rem] max-w-full items-center justify-center text-base md:text-lg",
    className,
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} data-header-theme={theme} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} data-header-theme={theme} className={classes}>
      {inner}
    </button>
  );
}
