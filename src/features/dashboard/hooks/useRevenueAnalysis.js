import { useMemo, useState } from 'react';
import { MOCK_CHART_DATA } from '../constants/dashboardData';

export function useRevenueAnalysis() {
    const [selectedDate, setSelectedDate] = useState('2026-03-01');

    const chartData = useMemo(() => {
        return MOCK_CHART_DATA;
    }, [selectedDate]);

    const stats = useMemo(() => ({
        totalEarnings: "$2.4M",
        earningsTrend: "+12.4%",
        totalCosts: "$842K",
        costsStatus: "Healthy"
    }), []);

    return {
        selectedDate,
        setSelectedDate,
        chartData,
        stats
    };
}
