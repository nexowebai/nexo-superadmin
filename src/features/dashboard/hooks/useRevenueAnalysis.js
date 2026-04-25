import { useMemo, useState } from "react";
import { MOCK_CHART_DATA } from "../constants/dashboardData";

export function useRevenueAnalysis() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  const chartData = useMemo(() => {
    // In a real app, we would filter based on dateRange
    return MOCK_CHART_DATA;
  }, [dateRange]);

  const stats = useMemo(
    () => ({
      totalEarnings: "$2.4M",
      earningsTrend: "+12.4%",
      totalCosts: "$842K",
      costsStatus: "Healthy",
    }),
    [],
  );

  return {
    dateRange,
    setDateRange,
    chartData,
    stats,
  };
}
