import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  Children,
  isValidElement,
} from "react";
import { bisector } from "d3-array";
import { scaleLinear, scaleTime } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { cn } from "@lib/cn";
import { ChartProvider } from "./ChartContext";
import { useChartInteraction } from "./hooks/useChartInteraction";
import { Area } from "./components/Area";

const DEFAULT_MARGIN = { top: 40, right: 40, bottom: 40, left: 40 };

function isPostOverlayComponent(child) {
  const childType = child.type;
  if (childType.__isChartMarkers) return true;
  const name =
    typeof child.type === "function"
      ? childType.displayName || childType.name || ""
      : "";
  return name === "ChartTooltip" || name === "MarkerGroup";
}

function extractAreaConfigs(children) {
  const configs = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const name =
      typeof child.type === "function"
        ? child.type.displayName || child.type.name || ""
        : "";
    const props = child.props;
    const isArea =
      name === "Area" || child.type === Area || props?.dataKey?.length > 0;
    if (isArea && props?.dataKey)
      configs.push({
        dataKey: props.dataKey,
        stroke: props.stroke || props.fill || "var(--chart-line-primary)",
        strokeWidth: props.strokeWidth || 2,
      });
  });
  return configs;
}

function ChartInner({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  children,
  containerRef,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const lines = useMemo(() => extractAreaConfigs(children), [children]);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xAccessor = useCallback(
    (d) => (d[xDataKey] instanceof Date ? d[xDataKey] : new Date(d[xDataKey])),
    [xDataKey],
  );
  const bisectDate = useMemo(
    () => bisector((d) => xAccessor(d)).left,
    [xAccessor],
  );
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: [
          Math.min(...data.map((d) => xAccessor(d).getTime())),
          Math.max(...data.map((d) => xAccessor(d).getTime())),
        ],
      }),
    [innerWidth, data, xAccessor],
  );
  const yScale = useMemo(() => {
    let maxValue =
      Math.max(
        ...lines.flatMap((l) =>
          data.map((d) => d[l.dataKey]).filter((v) => typeof v === "number"),
        ),
      ) || 100;
    return scaleLinear({
      range: [innerHeight, 0],
      domain: [0, maxValue * 1.1],
      nice: true,
    });
  }, [innerHeight, data, lines]);

  const dateLabels = useMemo(
    () =>
      data.map((d) =>
        xAccessor(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ),
    [data, xAccessor],
  );
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), animationDuration);
    return () => clearTimeout(timer);
  }, [animationDuration]);

  const {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers,
    interactionStyle,
  } = useChartInteraction({
    xScale,
    yScale,
    data,
    lines,
    margin,
    xAccessor,
    bisectDate,
    canInteract: isLoaded,
  });

  if (width < 10 || height < 10) return null;

  const preOverlay = [],
    postOverlay = [];
  Children.forEach(children, (child) =>
    isPostOverlayComponent(child)
      ? postOverlay.push(child)
      : preOverlay.push(child),
  );

  const contextValue = {
    data,
    xScale,
    yScale,
    width,
    height,
    innerWidth,
    innerHeight,
    margin,
    columnWidth: innerWidth / (data.length - 1),
    tooltipData,
    setTooltipData,
    containerRef,
    lines,
    isLoaded,
    animationDuration,
    xAccessor,
    dateLabels,
    selection,
    clearSelection,
  };

  return (
    <ChartProvider value={contextValue}>
      <svg aria-hidden="true" height={height} width={width}>
        <defs>
          <clipPath id="chart-area-grow-clip">
            <rect
              height={innerHeight + 20}
              width={isLoaded ? innerWidth : 0}
              style={{
                transition: isLoaded
                  ? "none"
                  : `width ${animationDuration}ms cubic-bezier(0.85, 0, 0.15, 1)`,
              }}
            />
          </clipPath>
        </defs>
        <rect fill="transparent" height={height} width={width} />
        <g
          {...interactionHandlers}
          style={interactionStyle}
          transform={`translate(${margin.left},${margin.top})`}
        >
          <rect fill="transparent" height={innerHeight} width={innerWidth} />
          {preOverlay}
          {postOverlay}
        </g>
      </svg>
    </ChartProvider>
  );
}

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
