"use client";

import { useEffect, useState } from "react";
import type { BookImage } from "@/lib/book-details";

/** Grid of images from the book; tap one to see it full size (arrows / swipe-free buttons to move). */
export function BookGallery({ images }: { images: BookImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((im, i) => (
          <li key={im.src}>
            <button
              onClick={() => setOpen(i)}
              className="holo group block w-full overflow-hidden rounded-2xl border border-[#EAE4F7] bg-white text-left shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.caption} loading="lazy" className="aspect-[4/3] w-full bg-[#F8F5FF] object-contain" />
              <span className="block truncate px-3 py-2 text-xs font-medium text-[#5A5475] group-hover:text-[#FF3D8B]">{im.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[open].caption}
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#0E0A1F]/95 p-4"
          onClick={() => setOpen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open].src}
            alt={images[open].caption}
            className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="mt-3 text-sm text-white/80">
            {images[open].caption} · {open + 1}/{images.length}
          </p>
          <div className="mt-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen((open - 1 + images.length) % images.length)} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
              ← Prev
            </button>
            <button onClick={() => setOpen(null)} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
              Close ✕
            </button>
            <button onClick={() => setOpen((open + 1) % images.length)} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
