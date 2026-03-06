"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";

type Props = {
  /** All project image URLs (featured first, then gallery). Lightbox shows all; grid shows urls.slice(1). */
  imageUrls: string[];
};

export function ProjectGalleryLightbox({ imageUrls }: Props) {
  if (!imageUrls.length) return null;
  const galleryUrls = imageUrls.slice(1);
  if (!galleryUrls.length) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">Project Image Gallery</h2>
      <GalleryGrid imageUrls={imageUrls} />
    </section>
  );
}

function GalleryGrid({ imageUrls }: { imageUrls: string[] }) {
  const galleryUrls = imageUrls.slice(1);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i + 1);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? imageUrls.length - 1 : i - 1));
  }, [imageUrls.length]);
  const goNext = useCallback(() => {
    setIndex((i) => (i >= imageUrls.length - 1 ? 0 : i + 1));
  }, [imageUrls.length]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, goPrev, goNext]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryUrls.map((url, i) => (
          <li key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
            <button
              type="button"
              onClick={() => openAt(i)}
              className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-lg"
              aria-label={`View image ${i + 2} of ${imageUrls.length}`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover cursor-pointer"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white z-10"
            aria-label="Close"
          >
            <IconX size={28} stroke={2} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white z-10 sm:left-4"
            aria-label="Previous image"
          >
            <IconChevronLeft size={36} stroke={2} />
          </button>

          <div
            className="flex max-h-[85vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrls[index]}
              alt=""
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white z-10 sm:right-4"
            aria-label="Next image"
          >
            <IconChevronRight size={36} stroke={2} />
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/90">
            {index + 1} / {imageUrls.length}
          </p>
        </div>
      )}
    </>
  );
}
