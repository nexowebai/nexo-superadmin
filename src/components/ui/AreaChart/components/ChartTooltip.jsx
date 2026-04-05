import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, useSpring } from 'framer-motion';
import { useChart, chartCssVars } from '../ChartContext';
import { TooltipIndicator } from './TooltipIndicator';
import { TooltipDot } from './TooltipDot';
import { TooltipBox } from './TooltipBox';
import { TooltipContent } from './TooltipContent';
import { DateTicker } from './DateTicker';

export function ChartTooltip({
    showDatePill = true,
    showCrosshair = true,
    showDots = true,
    content,
    rows: rowsRenderer,
    children,
    className = "",
}) {
    const {
        tooltipData, width, height, innerHeight, margin,
        columnWidth, lines, xAccessor, dateLabels,
        containerRef, orientation, barXAccessor,
    } = useChart();

    const isHorizontal = orientation === "horizontal";
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const visible = tooltipData !== null;
    const x = tooltipData?.x ?? 0;
    const xWithMargin = x + margin.left;

    const firstLineDataKey = lines[0]?.dataKey;
    const firstLineY = firstLineDataKey ? (tooltipData?.yPositions[firstLineDataKey] ?? 0) : 0;
    const yWithMargin = firstLineY + margin.top;

    const animatedX = useSpring(xWithMargin, { stiffness: 300, damping: 30 });
    useEffect(() => { animatedX.set(xWithMargin); }, [xWithMargin, animatedX]);

    const tooltipRows = useMemo(() => {
        if (!tooltipData) return [];
        if (rowsRenderer) return rowsRenderer(tooltipData.point);
        return lines.map(line => ({
            color: line.stroke,
            label: line.dataKey,
            value: tooltipData.point[line.dataKey] ?? 0,
        }));
    }, [tooltipData, lines, rowsRenderer]);

    const title = useMemo(() => {
        if (!tooltipData) return undefined;
        if (barXAccessor) return barXAccessor(tooltipData.point);
        return xAccessor(tooltipData.point).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
        });
    }, [tooltipData, barXAccessor, xAccessor]);

    const container = containerRef.current;
    if (!(mounted && container)) return null;

    return createPortal(
        <>
            {showCrosshair && (
                <svg className="pointer-events-none absolute inset-0" height="100%" width="100%">
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        <TooltipIndicator
                            colorEdge={chartCssVars.crosshair}
                            colorMid={chartCssVars.crosshair}
                            columnWidth={columnWidth}
                            fadeEdges
                            height={innerHeight}
                            visible={visible}
                            x={x}
                        />
                    </g>
                </svg>
            )}

            {showDots && visible && !isHorizontal && (
                <svg className="pointer-events-none absolute inset-0" height="100%" width="100%">
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        {lines.map(line => (
                            <TooltipDot
                                color={line.stroke}
                                key={line.dataKey}
                                visible={visible}
                                x={tooltipData?.xPositions?.[line.dataKey] ?? x}
                                y={tooltipData?.yPositions[line.dataKey] ?? 0}
                            />
                        ))}
                    </g>
                </svg>
            )}

            <TooltipBox
                className={className}
                containerHeight={height}
                containerRef={containerRef}
                containerWidth={width}
                top={isHorizontal ? undefined : margin.top}
                visible={visible}
                x={xWithMargin}
                y={isHorizontal ? yWithMargin : margin.top}
            >
                {content ? content({ point: tooltipData?.point ?? {}, index: tooltipData?.index ?? 0 }) : (
                    <TooltipContent rows={tooltipRows} title={title}>
                        {children}
                    </TooltipContent>
                )}
            </TooltipBox>

            {showDatePill && dateLabels.length > 0 && visible && !isHorizontal && (
                <motion.div
                    className="pointer-events-none absolute z-50"
                    style={{ left: animatedX, transform: "translateX(-50%)", bottom: 4 }}
                >
                    <DateTicker currentIndex={tooltipData?.index ?? 0} labels={dateLabels} visible={visible} />
                </motion.div>
            )}
        </>,
        container
    );
}
