"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { imageAssets } from "@/data/site";
import { useHydrationSafeReducedMotion } from "@/lib/useReducedMotion";

export function HeroMedia() {
  const target = useRef<HTMLDivElement>(null);

  const reduceMotion = useHydrationSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 105]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.055, 1.12]);

  return (
    <div className="hero__media" ref={target}>
      <motion.div
        className="hero__media-inner"
        style={
          !reduceMotion
            ? { y, scale }
            : undefined
        }
      >
        <Image
          className="hero__image"
          src={imageAssets.SAHA_HERO_IMAGE}
          alt="Nasvietený barový pult v SAHA BARE"
          fill
          priority
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}
