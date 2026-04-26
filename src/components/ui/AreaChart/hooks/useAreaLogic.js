import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSpring, useMotionTemplate } from "framer-motion";

export function useAreaLogic({ 
  animate, 
  innerWidth, 
  isLoaded, 
  selection, 
  tooltipData, 
  data, 
  xScale, 
  xAccessor 
}) {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [clipWidth, setClipWidth] = useState(0);

  useEffect(() => {
    if (pathRef.current && animate) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) {
        setPathLength(len);
        if (!isLoaded) requestAnimationFrame(() => setClipWidth(innerWidth));
      }
    }
  }, [animate, innerWidth, isLoaded]);

  const findLengthAtX = useCallback(
    (targetX) => {
      const path = pathRef.current;
      if (!path || pathLength === 0) return 0;
      let low = 0, high = pathLength, tolerance = 0.5;
      while (high - low > tolerance) {
        const mid = (low + high) / 2;
        if (path.getPointAtLength(mid).x < targetX) low = mid;
        else high = mid;
      }
      return (low + high) / 2;
    },
    [pathLength],
  );

  const segmentBounds = useMemo(() => {
    if (!pathRef.current || pathLength === 0)
      return { startLength: 0, segmentLength: 0, isActive: false };
    
    if (selection?.active) {
      const startLength = findLengthAtX(selection.startX);
      const endLength = findLengthAtX(selection.endX);
      return { startLength, segmentLength: endLength - startLength, isActive: true };
    }
    
    if (!tooltipData)
      return { startLength: 0, segmentLength: 0, isActive: false };

    const idx = tooltipData.index;
    const startPoint = data[Math.max(0, idx - 1)];
    const endPoint = data[Math.min(data.length - 1, idx + 1)];
    
    if (!(startPoint && endPoint))
      return { startLength: 0, segmentLength: 0, isActive: false };

    const startLength = findLengthAtX(xScale(xAccessor(startPoint)) ?? 0);
    const endLength = findLengthAtX(xScale(xAccessor(endPoint)) ?? 0);
    
    return { startLength, segmentLength: endLength - startLength, isActive: true };
  }, [tooltipData, selection, data, xScale, pathLength, xAccessor, findLengthAtX]);

  const springConfig = { stiffness: 180, damping: 28 };
  const offsetSpring = useSpring(0, springConfig);
  const segmentLengthSpring = useSpring(0, springConfig);
  const animatedDasharray = useMotionTemplate`${segmentLengthSpring} ${pathLength}`;

  useEffect(() => {
    offsetSpring.set(-segmentBounds.startLength);
    segmentLengthSpring.set(segmentBounds.segmentLength);
  }, [segmentBounds, offsetSpring, segmentLengthSpring]);

  return {
    pathRef,
    pathLength,
    clipWidth,
    animatedDasharray,
    offsetSpring,
  };
}
