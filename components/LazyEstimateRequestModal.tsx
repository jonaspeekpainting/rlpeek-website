"use client";

import dynamic from "next/dynamic";

const EstimateRequestModal = dynamic(
  () => import("@/components/EstimateRequestModal").then((m) => ({ default: m.EstimateRequestModal })),
  { ssr: false }
);

export function LazyEstimateRequestModal() {
  return <EstimateRequestModal />;
}
