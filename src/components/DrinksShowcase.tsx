"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { drinks, menuGroups } from "@/data/drinks";
import { useHydrationSafeReducedMotion } from "@/lib/useReducedMotion";

export function DrinksShowcase({ compact = false }: { compact?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useHydrationSafeReducedMotion();

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    const close = () => { document.body.style.overflow = ""; };
    const open = () => { document.body.style.overflow = "hidden"; };
    dialog?.addEventListener("close", close);
    dialog?.addEventListener("cancel", close);
    if (dialog?.open) open();
    return () => {
      close();
      dialog?.removeEventListener("close", close);
      dialog?.removeEventListener("cancel", close);
    };
  }, []);

  const visible = compact ? drinks.slice(0, 4) : drinks;

  return (
    <>
      <div className="drinks-grid">
        {visible.map((drink, index) => (
          <motion.article
            className="drink-card"
            key={drink.name}
            initial={reduceMotion ? false : { opacity: 0, y: 34 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.65, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="drink-card__image">
              <Image
                src={drink.image}
                alt={`Atmosférický detail k drinku ${drink.name}`}
                fill
                sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 31vw"
                style={{ objectPosition: drink.position }}
              />
              <span>0{index + 1}</span>
              <b>{drink.type}</b>
            </div>
            <div className="drink-card__body">
              <div><h3>{drink.name}</h3><strong>{drink.price}</strong></div>
              <p>{drink.description}</p>
              <small>{drink.ingredients}</small>
            </div>
          </motion.article>
        ))}
      </div>
      {compact && <div className="section-action"><button className="button button--secondary" type="button" onClick={() => { document.body.style.overflow = "hidden"; openMenu(); }}>Zobraziť celé menu</button></div>}
      <dialog className="menu-dialog" ref={dialogRef} onClick={(event) => event.target === dialogRef.current && closeMenu()}>
        <div className="menu-dialog__panel">
          <button className="icon-button" type="button" aria-label="Zavrieť menu" onClick={closeMenu}><X /></button>
          <p className="eyebrow">SAHA BAR · DRINK MENU</p>
          <h2>Drinky pre každý<br /><em>dobrý večer.</em></h2>
          <p className="menu-dialog__notice">Ceny a zloženie sú pripravené ako upraviteľné položky. Pred zverejnením ich doplňte podľa aktuálnej ponuky.</p>
          {menuGroups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((drink) => (
                <div className="menu-row" key={drink.name}>
                  <div><b>{drink.name}</b><span>{drink.ingredients}</span></div>
                  <strong>{drink.price}</strong>
                </div>
              ))}
            </section>
          ))}
        </div>
      </dialog>
    </>
  );
}
