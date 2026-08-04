"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { events } from "@/data/events";
import { useHydrationSafeReducedMotion } from "@/lib/useReducedMotion";

export function EventsSlider({ showAll = true }: { showAll?: boolean }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useHydrationSafeReducedMotion();
  const visible = showAll ? events : events.slice(0, 4);

  const go = (direction: -1 | 1) => {
    const next = (active + direction + visible.length) % visible.length;
    setActive(next);
    refs.current[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="events-slider-wrap">
      <div className="events-timeline" aria-hidden="true"><span style={{ width: `${((active + 1) / visible.length) * 100}%` }} /></div>
      <div className="events-slider">
        {visible.map((event, index) => (
          <motion.div
            className="event-card-motion"
            key={`${event.name}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.62, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <article
              className={`event-card ${index === active ? "event-card--active" : ""}`}
              ref={(node) => { refs.current[index] = node; }}
              onClick={() => setActive(index)}
            >
              <div className="event-card__image">
                <Image src={event.image} alt={`Atmosféra podujatia ${event.name}`} fill sizes="(max-width: 720px) 86vw, 42vw" />
                <div className="event-card__date"><b>{event.date}</b><span>{event.day}</span></div>
              </div>
              <div className="event-card__body">
                <p>{event.time}</p>
                <h3>{event.name}</h3>
                <span>{event.description}</span>
                <div>
                  <Link href={`/podujatia#event-${index + 1}`}>Zobraziť podujatie</Link>
                  <Link href="/#rezervacia">Rezervovať stôl</Link>
                </div>
              </div>
            </article>
          </motion.div>
        ))}
      </div>
      <div className="slider-controls">
        <button type="button" onClick={() => go(-1)} aria-label="Predchádzajúce podujatie"><ArrowLeft /></button>
        <span>{String(active + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => go(1)} aria-label="Ďalšie podujatie"><ArrowRight /></button>
      </div>
    </div>
  );
}
