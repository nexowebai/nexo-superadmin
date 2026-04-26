import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";

export function TooltipContent({ title, rows, children }) {
  const [measureRef, bounds] = useMeasure({ debounce: 0, scroll: false });
  const [committedHeight, setCommittedHeight] = useState(null);
  const committedChildrenStateRef = useRef(null);
  const frameRef = useRef(null);

  const hasChildren = !!children;
  const markerKey = hasChildren ? "has-marker" : "no-marker";

  const isWaitingForSettlement =
    committedChildrenStateRef.current !== null &&
    committedChildrenStateRef.current !== hasChildren;

  useEffect(() => {
    if (bounds.height <= 0) return;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (isWaitingForSettlement) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setCommittedHeight(bounds.height);
          committedChildrenStateRef.current = hasChildren;
        });
      });
    } else {
      setCommittedHeight(bounds.height);
      committedChildrenStateRef.current = hasChildren;
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [bounds.height, hasChildren, isWaitingForSettlement]);

  const shouldAnimate = committedHeight !== null;

  return (
    <motion.div
      animate={
        committedHeight !== null ? { height: committedHeight } : undefined
      }
      className="overflow-hidden"
      initial={false}
      transition={
        shouldAnimate
          ? { type: "spring", stiffness: 500, damping: 35, mass: 0.8 }
          : { duration: 0 }
      }
    >
      <div className="px-3 py-2.5" ref={measureRef}>
        {title && (
          <div className="mb-2 font-medium text-[var(--text-muted)] text-xs">
            {title}
          </div>
        )}
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              className="flex items-center justify-between gap-4"
              key={`${row.label}-${row.color}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  /* allowed-inline */
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-[var(--text-secondary)] text-sm">
                  {row.label}
                </span>
              </div>
              <span className="font-medium text-[var(--text-primary)] text-sm tabular-nums">
                {typeof row.value === "number"
                  ? row.value.toLocaleString()
                  : row.value}
              </span>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {children && (
            <motion.div
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className="mt-2"
              exit={{ opacity: 0, filter: "blur(4px)" }}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              key={markerKey}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
