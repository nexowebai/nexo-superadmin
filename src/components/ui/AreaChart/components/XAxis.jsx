import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useChart } from "../ChartContext";
import { cn } from "@lib/cn";

function XAxisLabel({ label, x, crosshairX, isHovering, tickerHalfWidth }) {
  const fadeBuffer = 20;
  const fadeRadius = tickerHalfWidth + fadeBuffer;

  let opacity = 1;
  if (isHovering && crosshairX !== null) {
    const distance = Math.abs(x - crosshairX);
    if (distance < tickerHalfWidth) opacity = 0;
    else if (distance < fadeRadius)
      opacity = (distance - tickerHalfWidth) / fadeBuffer;
  }

  return (
    <div
      className="absolute"
      /* allowed-inline */
      style={{
        left: x,
        bottom: 12,
        width: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.span
        animate={{ opacity }}
        className={cn("whitespace-nowrap text-chart-label text-xs")}
        initial={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {label}
      </motion.span>
    </div>
  );
}

export function XAxis({ numTicks = 5, tickerHalfWidth = 50 }) {
  const { xScale, margin, tooltipData, containerRef } = useChart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labelsToShow = useMemo(() => {
    const domain = xScale.domain();
    const startDate = domain[0];
    const endDate = domain[1];
    if (!(startDate && endDate)) return [];

    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const timeRange = endTime - startTime;
    const tickCount = Math.max(2, numTicks);
    const dates = [];

    for (let i = 0; i < tickCount; i++) {
      const t = i / (tickCount - 1);
      dates.push(new Date(startTime + t * timeRange));
    }

    return dates.map((date) => ({
      date,
      x: (xScale(date) ?? 0) + margin.left,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [xScale, margin.left, numTicks]);

  const isHovering = tooltipData !== null;
  const crosshairX = tooltipData ? tooltipData.x + margin.left : null;
  const container = containerRef.current;

  if (!(mounted && container)) return null;

  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      {labelsToShow.map((item) => (
        <XAxisLabel
          crosshairX={crosshairX}
          isHovering={isHovering}
          key={`${item.label}-${item.x}`}
          label={item.label}
          tickerHalfWidth={tickerHalfWidth}
          x={item.x}
        />
      ))}
    </div>,
    container,
  );
}
