"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/lib/useReducedMotion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "image" | "scale";
};

const states = {
  default: {
    initial: { opacity: 0, y: 34 },
    animate: { opacity: 1, y: 0 },
  },
  image: {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "default",
}: RevealProps) {
  const reduceMotion = useHydrationSafeReducedMotion();

  const animation = states[variant];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={animation.initial}
      whileInView={animation.animate}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
