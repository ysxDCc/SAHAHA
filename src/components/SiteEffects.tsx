"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { imageAssets } from "@/data/site";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 95, damping: 24, mass: 0.35 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function CursorAura() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (min-width: 900px)");
    if (!media.matches) return;
    const target = { x: -50, y: -50 };
    const current = { x: -50, y: -50 };
    let frame = 0;
    const move = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const render = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      if (cursor.current) cursor.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      cursor.current?.classList.toggle("cursor-aura--active", Boolean(target.closest("a, button, [data-cursor]")));
      cursor.current?.classList.toggle("cursor-aura--view", Boolean(target.closest("[data-cursor='view']")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  return <div ref={cursor} className="cursor-aura" aria-hidden="true"><span>View</span></div>;
}

export function Preloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(reducedTimer);
    }
    const timer = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__logo"><Image src={imageAssets.SAHA_LOGO_OFFICIAL} alt="" width={132} height={132} priority /></div>
      <p><span>SAHA</span><i>BAR</i></p>
      <b><span /></b>
    </div>
  );
}
