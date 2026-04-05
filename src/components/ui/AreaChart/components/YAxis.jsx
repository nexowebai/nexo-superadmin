import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useChart } from '../ChartContext';

export function YAxis({ numTicks = 5, formatValue }) {
    const { yScale, margin, containerRef } = useChart();
    const [container, setContainer] = useState(null);

    useEffect(() => { setContainer(containerRef.current); }, [containerRef]);

    const ticks = useMemo(() => {
        const domain = yScale.domain();
        const min = domain[0];
        const max = domain[1];
        const step = (max - min) / (numTicks - 1);

        return Array.from({ length: numTicks }, (_, i) => {
            const value = min + step * i;
            return {
                value,
                y: (yScale(value) ?? 0) + margin.top,
                label: formatValue ? formatValue(value)
                    : value >= 1000 ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
                    : value.toLocaleString(),
            };
        });
    }, [yScale, margin.top, numTicks, formatValue]);

    if (!container) return null;

    return createPortal(
        <div className="pointer-events-none absolute inset-0">
            {ticks.map(tick => (
                <div
                    key={tick.value} className="absolute"
                    style={{
                        left: 0, top: tick.y, width: margin.left - 8,
                        display: "flex", justifyContent: "flex-end", transform: "translateY(-50%)",
                    }}
                >
                    <span className="whitespace-nowrap text-[#9f9f9f] text-[10px] font-bold uppercase tracking-tighter tabular-nums">
                        {tick.label}
                    </span>
                </div>
            ))}
        </div>,
        container
    );
}
