import React from "react";

export function AreaGradients({ 
  gradientId, 
  strokeGradientId, 
  edgeGradientId, 
  edgeMaskId, 
  fill, 
  fillOpacity, 
  gradientToOpacity, 
  resolvedStroke, 
  fadeEdges, 
  innerHeight, 
  innerWidth, 
  animate, 
  dataKey, 
  isLoaded, 
  clipWidth, 
  animationDuration 
}) {
  const easing = "cubic-bezier(0.85, 0, 0.15, 1)";
  
  return (
    <defs>
      <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
        <stop
          offset="0%"
          /* allowed-inline */
          style={{ stopColor: fill, stopOpacity: fillOpacity }}
        />
        <stop
          offset="100%"
          /* allowed-inline */
          style={{ stopColor: fill, stopOpacity: gradientToOpacity }}
        />
      </linearGradient>
      
      <linearGradient id={strokeGradientId} x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" style={{ stopColor: resolvedStroke, stopOpacity: 0 }} /* allowed-inline */ />
        <stop offset="15%" style={{ stopColor: resolvedStroke, stopOpacity: 1 }} /* allowed-inline */ />
        <stop offset="85%" style={{ stopColor: resolvedStroke, stopOpacity: 1 }} /* allowed-inline */ />
        <stop offset="100%" style={{ stopColor: resolvedStroke, stopOpacity: 0 }} /* allowed-inline */ />
      </linearGradient>

      {fadeEdges && (
        <>
          <linearGradient id={edgeGradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} /* allowed-inline */ />
            <stop offset="20%" style={{ stopColor: "white", stopOpacity: 1 }} /* allowed-inline */ />
            <stop offset="80%" style={{ stopColor: "white", stopOpacity: 1 }} /* allowed-inline */ />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} /* allowed-inline */ />
          </linearGradient>
          <mask id={edgeMaskId}>
            <rect fill={`url(#${edgeGradientId})`} height={innerHeight} width={innerWidth} x="0" y="0" />
          </mask>
        </>
      )}

      {animate && (
        <clipPath id={`grow-clip-area-${dataKey}`}>
          <rect
            height={innerHeight + 20} y={0} x={0}
            /* allowed-inline */
            style={{
              transition: !isLoaded && clipWidth > 0
                ? `width ${animationDuration}ms ${easing}`
                : "none",
            }}
            width={isLoaded ? innerWidth : clipWidth}
          />
        </clipPath>
      )}
    </defs>
  );
}
