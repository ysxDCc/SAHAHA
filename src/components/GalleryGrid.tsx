"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { galleryItems } from "@/data/gallery";
import { useHydrationSafeReducedMotion } from "@/lib/useReducedMotion";

export function GalleryGrid({ limit }: { limit?: number }) {
  const items = limit ? galleryItems.slice(0, limit) : galleryItems;
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef(0);
  const reduceMotion = useHydrationSafeReducedMotion();

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const move = (direction: -1 | 1) => setActive((current) => current === null ? 0 : (current + direction + items.length) % items.length);

  useEffect(() => {
    document.body.style.overflow = active === null ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (active === null) return;
      if (event.key === "ArrowLeft") setActive((active - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setActive((active + 1) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, items.length]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <motion.button
            className={`gallery-item gallery-item--${item.span}`}
            type="button"
            key={`${item.src}-${index}`}
            onClick={() => open(index)}
            data-cursor="view"
            aria-label={`Otvoriť fotografiu: ${item.alt}`}
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.975 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.7, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 34vw" />
            <span>{item.category}</span>
          </motion.button>
        ))}
      </div>
      <dialog
        className="lightbox"
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(event) => event.target === dialogRef.current && close()}
        onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
        onTouchEnd={(event) => {
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
        }}
      >
        <button className="lightbox__close" type="button" onClick={close} aria-label="Zavrieť galériu"><X /></button>
        <button className="lightbox__prev" type="button" onClick={() => move(-1)} aria-label="Predchádzajúca fotografia"><ArrowLeft /></button>
        {active !== null && (
          <figure>
            <div><Image src={items[active].src} alt={items[active].alt} fill sizes="94vw" /></div>
            <figcaption><span>{items[active].category}</span>{items[active].alt}</figcaption>
          </figure>
        )}
        <button className="lightbox__next" type="button" onClick={() => move(1)} aria-label="Ďalšia fotografia"><ArrowRight /></button>
      </dialog>
    </>
  );
}
