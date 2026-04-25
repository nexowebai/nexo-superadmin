import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryClient";
import { dashboardService } from "../services/dashboardService";
import { STATS_CONFIG, MOCK_ORGANIZATIONS } from "../constants/dashboardData";
import { formatNumber } from "@utils/format";

export function useDashboard() {
  const { data: rawData, isLoading: loading } = useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardService.getStats(),
    select: (response) =>
      response?.data?.stats || response?.stats || response?.data || null,
    staleTime: 2 * 60 * 1000,
  });

  const metrics = useMemo(() => {
    const summary = rawData?.summary || [];
    return STATS_CONFIG.map((config, index) => {
      const stat = summary.find((s) => s.key === config.key);
      const value = stat?.value ?? (config.key === "avg_latency" ? 18 : 0);
      return {
        ...config,
        value: config.isPercent
          ? `${value}%`
          : config.key === "avg_latency"
            ? `${value}ms`
            : formatNumber(value),
        trend: Math.floor(Math.random() * 30) - 10,
        delay: index * 0.05,
      };
    });
  }, [rawData]);

  const organizations = useMemo(() => {
    return rawData?.organizations || MOCK_ORGANIZATIONS;
  }, [rawData]);

  return {
    metrics,
    organizations,
    loading,
    rawData,
  };
}
