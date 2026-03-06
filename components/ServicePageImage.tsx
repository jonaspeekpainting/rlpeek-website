"use client";

import { useState } from "react";

const FALLBACK_SRC = "/images/hero.jpg";

export function ServicePageImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      onError={() => setCurrentSrc(FALLBACK_SRC)}
    />
  );
}
