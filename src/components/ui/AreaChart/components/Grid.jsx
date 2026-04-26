import { useId } from "react";
import { GridColumns, GridRows } from "@visx/grid";
import { useChart, chartCssVars } from "../ChartContext";

export function Grid({
  horizontal = true,
  vertical = false,
  numTicksRows = 5,
  numTicksColumns = 10,
  rowTickValues,
  stroke = chartCssVars.grid,
  strokeOpacity = 0.5,
  strokeWidth = 1,
  strokeDasharray = "4,4",
  fadeHorizontal = true,
  fadeVertical = false,
}) {
  const { xScale, yScale, innerWidth, innerHeight, orientation, barScale } =
    useChart();
  const isHorizontalBarChart = orientation === "horizontal" && barScale;
  const columnScale = isHorizontalBarChart ? yScale : xScale;
  const uniqueId = useId();

  const hMaskId = `grid-rows-fade-${uniqueId}`;
  const vMaskId = `grid-cols-fade-${uniqueId}`;

  return (
    <g className="chart-grid">
      {horizontal && fadeHorizontal && (
        <defs>
          <linearGradient
            id={`${hMaskId}-gradient`}
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop offset="0%" /* allowed-inline */ style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="10%" /* allowed-inline */ style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="90%" /* allowed-inline */ style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop
              offset="100%"
              /* allowed-inline */
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
          </linearGradient>
          <mask id={hMaskId}>
            <rect
              fill={`url(#${hMaskId}-gradient)`}
              height={innerHeight}
              width={innerWidth}
              x="0"
              y="0"
            />
          </mask>
        </defs>
      )}

      {vertical && fadeVertical && (
        <defs>
          <linearGradient
            id={`${vMaskId}-gradient`}
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" /* allowed-inline */ style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="10%" /* allowed-inline */ style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="90%" /* allowed-inline */ style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop
              offset="100%"
              /* allowed-inline */
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
          </linearGradient>
          <mask id={vMaskId}>
            <rect
              fill={`url(#${vGradientId})`}
              height={innerHeight}
              width={innerWidth}
              x="0"
              y="0"
            />
          </mask>
        </defs>
      )}

      {horizontal && (
        <g mask={fadeHorizontal ? `url(#${hMaskId})` : undefined}>
          <GridRows
            numTicks={rowTickValues ? undefined : numTicksRows}
            scale={yScale}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            tickValues={rowTickValues}
            width={innerWidth}
          />
        </g>
      )}
      {vertical && columnScale && typeof columnScale === "function" && (
        <g mask={fadeVertical ? `url(#${vMaskId})` : undefined}>
          <GridColumns
            height={innerHeight}
            numTicks={numTicksColumns}
            scale={columnScale}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
          />
        </g>
      )}
    </g>
  );
}
