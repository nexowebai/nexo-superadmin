import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useSpring } from "framer-motion";
import { cn } from "@lib/cn";

export function TooltipBox({
  x,
  y,
  visible,
  containerRef,
  containerWidth,
  containerHeight,
  offset = 16,
  className = "",
  children,
  left: leftOverride,
  top: topOverride,
  flipped: flippedOverride,
}) {
  const tooltipRef = useRef(null);
  const [tooltipWidth, setTooltipWidth] = useState(180);
  const [tooltipHeight, setTooltipHeight] = useState(80);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const w = tooltipRef.current.offsetWidth;
      const h = tooltipRef.current.offsetHeight;
      if (w > 0 && w !== tooltipWidth) setTooltipWidth(w);
      if (h > 0 && h !== tooltipHeight) setTooltipHeight(h);
    }
  }, [tooltipWidth, tooltipHeight]);

  const shouldFlipX = x + tooltipWidth + offset > containerWidth;
  const targetX = shouldFlipX ? x - offset - tooltipWidth : x + offset;
  const targetY = Math.max(
    offset,
    Math.min(y - tooltipHeight / 2, containerHeight - tooltipHeight - offset),
  );

  const [flipKey, setFlipKey] = useState(0);
  const prevFlipRef = useRef(shouldFlipX);

  useEffect(() => {
    if (prevFlipRef.current !== shouldFlipX) {
      setFlipKey((k) => k + 1);
      prevFlipRef.current = shouldFlipX;
    }
  }, [shouldFlipX]);

  const springConfig = { stiffness: 100, damping: 20 };
  const animatedLeft = useSpring(targetX, springConfig);
  const animatedTop = useSpring(targetY, springConfig);

  useEffect(() => {
    animatedLeft.set(targetX);
  }, [targetX, animatedLeft]);
  useEffect(() => {
    animatedTop.set(targetY);
  }, [targetY, animatedTop]);

  const finalLeft = leftOverride ?? animatedLeft;
  const finalTop = topOverride ?? animatedTop;
  const isFlipped = flippedOverride ?? shouldFlipX;
  const container = containerRef.current;

  if (!(mounted && container) || !visible) return null;

  return createPortal(
    <motion.div
      animate={{ opacity: 1 }}
      className={cn("pointer-events-none absolute z-50", className)}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      ref={tooltipRef}
      /* allowed-inline */
      style={{ left: finalLeft, top: finalTop }}
      transition={{ duration: 0.1 }}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1, x: 0 }}
        className="min-w-[140px] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-xl)] backdrop-blur-md border border-[var(--border-base)]"
        initial={{ scale: 0.85, opacity: 0, x: isFlipped ? 20 : -20 }}
        key={flipKey}
        /* allowed-inline */
        style={{ transformOrigin: isFlipped ? "right top" : "left top" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {children}
      </motion.div>
    </motion.div>,
    container,
  );
}
