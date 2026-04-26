import { Children, isValidElement } from "react";
import { Area } from "./components/Area";

export function isPostOverlayComponent(child) {
  const childType = child.type;
  if (childType.__isChartMarkers) return true;
  const name =
    typeof child.type === "function"
      ? childType.displayName || childType.name || ""
      : "";
  return name === "ChartTooltip" || name === "MarkerGroup";
}

export function extractAreaConfigs(children) {
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
