"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = "rlpeek_marketing_source";

/**
 * Captures the `source` query param (e.g. ?source=google-vision) and stores it
 * in sessionStorage so the contact form can prefill and lock "How did you hear about us?"
 */
export function MarketingSourceCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("source");
    if (source && typeof source === "string" && source.trim()) {
      try {
        sessionStorage.setItem(STORAGE_KEY, source.trim());
      } catch {
        // ignore storage errors
      }
    }
  }, [searchParams]);

  return null;
}

export { STORAGE_KEY as MARKETING_SOURCE_STORAGE_KEY };
