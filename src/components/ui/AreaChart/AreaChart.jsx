import { useRef } from "react";
import { ParentSize } from "@visx/responsive";
import { cn } from "@lib/cn";
import { ChartInner } from "./components/ChartInner";

const DEFAULT_MARGIN = { top: 40, right: 40, bottom: 40, left: 40 };

export function AreaChart({
  data,
  xDataKey = "date",
  margin: marginProp,
  animationDuration = 1100,
  aspectRatio = "2 / 1",
  className = "",
  children,
}) {
  const containerRef = useRef(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  
  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      /* allowed-inline */
      style={{ aspectRatio, touchAction: "none" }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            animationDuration={animationDuration}
            containerRef={containerRef}
            data={data}
            height={height}
            margin={margin}
            width={width}
            xDataKey={xDataKey}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  );
}

export default AreaChart;
