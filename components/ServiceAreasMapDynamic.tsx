"use client";

import dynamic from "next/dynamic";
import type { PageMeta } from "@/lib/content";

const ServiceAreasMap = dynamic(
  () => import("@/components/ServiceAreasMap").then((m) => m.ServiceAreasMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-500">
        Loading map…
      </div>
    ),
  }
);

type Props = { areas: PageMeta[]; className?: string };

export function ServiceAreasMapDynamic({ areas, className }: Props) {
  return <ServiceAreasMap areas={areas} className={className} />;
}
