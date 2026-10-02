"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping background video that isn't downloaded until it comes near
 * the viewport, and pauses while it's off screen. The poster shows until the
 * first frames are in.
 */
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute("src")) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" />;
}
