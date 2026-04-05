import { useCallback } from "react";

export const getTooltipResolver = ({
  xScale,
  yScale,
  data,
  lines,
  xAccessor,
  bisectDate,
}) => {
  return (pixelX) => {
    const x0 = xScale.invert(pixelX);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    if (!d0) return null;

    let d = d0;
    let finalIndex = index - 1;
    if (d1) {
      const d0Time = xAccessor(d0).getTime();
      const d1Time = xAccessor(d1).getTime();
      if (x0.getTime() - d0Time > d1Time - x0.getTime()) {
        d = d1;
        finalIndex = index;
      }
    }

    const yPositions = {};
    for (const line of lines) {
      const value = d[line.dataKey];
      if (typeof value === "number")
        yPositions[line.dataKey] = yScale(value) ?? 0;
    }

    return {
      point: d,
      index: finalIndex,
      x: xScale(xAccessor(d)) ?? 0,
      yPositions,
    };
  };
};

export const getIndexResolver = ({ xScale, data, xAccessor, bisectDate }) => {
  return (pixelX) => {
    const x0 = xScale.invert(pixelX);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    if (!d0) return 0;
    if (d1) {
      const d0Time = xAccessor(d0).getTime();
      const d1Time = xAccessor(d1).getTime();
      if (x0.getTime() - d0Time > d1Time - x0.getTime()) return index;
    }
    return index - 1;
  };
};
