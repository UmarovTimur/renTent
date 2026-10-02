"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * `next/image` with a shimmering skeleton on top until the photo has loaded,
 * then the skeleton fades away. The image itself is left untouched, so its
 * own classes (opacity, transforms) keep working. Meant for `fill` images:
 * the skeleton covers the same positioned parent. Give it a `key` of the src
 * when the src changes in place, so the skeleton shows again for the new one.
 */
export function LoadingImage({ alt, onLoad, skeletonClassName, ...props }: ImageProps & { skeletonClassName?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <Image
        {...props}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
      <span
        aria-hidden
        className={cn(
          "q-shimmer pointer-events-none absolute inset-0 transition-opacity duration-500",
          loaded && "opacity-0",
          skeletonClassName,
        )}
      />
    </>
  );
}
