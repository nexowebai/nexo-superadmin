import { useCallback, useId } from "react";
import { motion } from "framer-motion";
import { AreaClosed, LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { useChart, chartCssVars } from "../ChartContext";
import { useAreaLogic } from "../hooks/useAreaLogic";
import { AreaGradients } from "./AreaGradients";

export function Area({
  dataKey,
  fill = chartCssVars.linePrimary,
  fillOpacity = 0.4,
  stroke,
  strokeWidth = 2,
  curve = curveMonotoneX,
  animate = true,
  showLine = true,
  showHighlight = true,
  gradientToOpacity = 0,
  fadeEdges = false,
}) {
  const {
    data, xScale, yScale, innerHeight, innerWidth,
    tooltipData, selection, isLoaded, animationDuration, xAccessor,
  } = useChart();

  const uniqueId = useId();
  const gradientId = `area-gradient-${dataKey}-${uniqueId}`;
  const strokeGradientId = `area-stroke-gradient-${dataKey}-${uniqueId}`;
  const edgeMaskId = `area-edge-mask-${dataKey}-${uniqueId}`;
  const edgeGradientId = `${edgeMaskId}-gradient`;
  const resolvedStroke = stroke || fill;

  const {
    pathRef, clipWidth, animatedDasharray, offsetSpring
  } = useAreaLogic({
    animate, innerWidth, isLoaded, selection, tooltipData, data, xScale, xAccessor
  });

  const getY = useCallback((d) => {
    const value = d[dataKey];
    return typeof value === "number" ? (yScale(value) ?? 0) : 0;
  }, [dataKey, yScale]);

  const isHovering = tooltipData !== null || selection?.active === true;

  return (
    <>
      <AreaGradients 
        gradientId={gradientId} strokeGradientId={strokeGradientId}
        edgeGradientId={edgeGradientId} edgeMaskId={edgeMaskId}
        fill={fill} fillOpacity={fillOpacity} gradientToOpacity={gradientToOpacity}
        resolvedStroke={resolvedStroke} fadeEdges={fadeEdges}
        innerHeight={innerHeight} innerWidth={innerWidth}
        animate={animate} dataKey={dataKey} isLoaded={isLoaded}
        clipWidth={clipWidth} animationDuration={animationDuration}
      />

      <g clipPath={animate ? `url(#grow-clip-area-${dataKey})` : undefined}>
        <motion.g
          animate={{ opacity: isHovering && showHighlight ? 0.6 : 1 }}
          initial={{ opacity: 1 }}
        >
          <g mask={fadeEdges ? `url(#${edgeMaskId})` : undefined}>
            <AreaClosed
              curve={curve} data={data} fill={`url(#${gradientId})`}
              x={(d) => xScale(xAccessor(d)) ?? 0} y={getY} yScale={yScale}
            />
          </g>
          {showLine && (
            <LinePath
              curve={curve} data={data} innerRef={pathRef}
              stroke={`url(#${strokeGradientId})`} strokeLinecap="round"
              strokeWidth={strokeWidth} x={(d) => xScale(xAccessor(d)) ?? 0} y={getY}
            />
          )}
          {data.map((d, i) => (
            <circle
              key={i} cx={xScale(xAccessor(d))} cy={getY(d)} r={3}
              fill={resolvedStroke} stroke="#fff" strokeWidth={1}
              className="transition-all duration-300 hover:r-4"
            />
          ))}
        </motion.g>
      </g>

      {showHighlight && showLine && isHovering && isLoaded && pathRef.current && (
        <motion.path
          animate={{ opacity: 1 }} d={pathRef.current.getAttribute("d") || ""}
          exit={{ opacity: 0 }} initial={{ opacity: 0 }}
          stroke={resolvedStroke} strokeLinecap="round" strokeWidth={strokeWidth}
          transition={{ duration: 0.4 }}
          /* allowed-inline */
          style={{ strokeDasharray: animatedDasharray, strokeDashoffset: offsetSpring }}
        />
      )}
    </>
  );
}
