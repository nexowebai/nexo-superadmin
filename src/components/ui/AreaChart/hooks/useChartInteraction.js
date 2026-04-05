import { useState, useRef, useCallback } from "react";
import { localPoint } from "@visx/event";
import { getTooltipResolver, getIndexResolver } from "./utils/interactionResolvers";

export function useChartInteraction({ xScale, yScale, data, lines, margin, xAccessor, bisectDate, canInteract }) {
  const [tooltipData, setTooltipData] = useState(null);
  const [selection, setSelection] = useState(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  const resolveTooltipFromX = useCallback(getTooltipResolver({ xScale, yScale, data, lines, xAccessor, bisectDate }), [xScale, yScale, data, lines, xAccessor, bisectDate]);
  const resolveIndexFromX = useCallback(getIndexResolver({ xScale, data, xAccessor, bisectDate }), [xScale, data, xAccessor, bisectDate]);

  const getChartX = useCallback((event, touchIndex = 0) => {
    let point = null;
    if ("touches" in event) {
      const touch = event.touches[touchIndex];
      const svg = event.currentTarget.ownerSVGElement;
      if (!touch || !svg) return null;
      point = localPoint(svg, touch);
    } else {
      point = localPoint(event);
    }
    return point ? point.x - margin.left : null;
  }, [margin.left]);

  const handleMouseMove = useCallback((event) => {
    const chartX = getChartX(event);
    if (chartX === null) return;
    if (isDraggingRef.current) {
      const startX = Math.min(dragStartXRef.current, chartX);
      const endX = Math.max(dragStartXRef.current, chartX);
      setSelection({ startX, endX, startIndex: resolveIndexFromX(startX), endIndex: resolveIndexFromX(endX), active: true });
    } else {
      const tooltip = resolveTooltipFromX(chartX);
      if (tooltip) setTooltipData(tooltip);
    }
  }, [getChartX, resolveTooltipFromX, resolveIndexFromX]);

  const handleMouseDown = useCallback((event) => {
    const chartX = getChartX(event);
    if (chartX === null) return;
    isDraggingRef.current = true;
    dragStartXRef.current = chartX;
    setTooltipData(null);
    setSelection(null);
  }, [getChartX]);

  const handleTouch = useCallback((event) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      const chartX = getChartX(event, 0);
      if (chartX !== null) {
        const tooltip = resolveTooltipFromX(chartX);
        if (tooltip) setTooltipData(tooltip);
      }
    } else if (event.touches.length === 2) {
      event.preventDefault();
      setTooltipData(null);
      const x0 = getChartX(event, 0), x1 = getChartX(event, 1);
      if (x0 === null || x1 === null) return;
      const startX = Math.min(x0, x1), endX = Math.max(x0, x1);
      setSelection({ startX, endX, startIndex: resolveIndexFromX(startX), endIndex: resolveIndexFromX(endX), active: true });
    }
  }, [getChartX, resolveTooltipFromX, resolveIndexFromX]);

  const interactionHandlers = canInteract ? {
    onMouseMove: handleMouseMove,
    onMouseLeave: () => { setTooltipData(null); isDraggingRef.current = false; setSelection(null); },
    onMouseDown: handleMouseDown,
    onMouseUp: () => { isDraggingRef.current = false; setSelection(null); },
    onTouchStart: handleTouch, onTouchMove: handleTouch, onTouchEnd: () => { setTooltipData(null); setSelection(null); }
  } : {};

  return { tooltipData, setTooltipData, selection, clearSelection: () => setSelection(null), interactionHandlers, interactionStyle: { cursor: canInteract ? "crosshair" : "default", touchAction: "none" } };
}
