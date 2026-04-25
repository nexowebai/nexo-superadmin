import { useState, useEffect } from "react";
import { 
  useOrganizations, 
  useEnableOrganization, 
  useDeleteOrganization, 
  useUpdateOrganization 
} from "./useOrganizations";
import { useMutationAction } from "@hooks";

export function useOrganizationsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tier, setTier] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // Simple debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to first page on filter change
  useEffect(() => setPage(1), [debouncedSearch, status, tier, limit]);

  const { data, isLoading: loading, refetch } = useOrganizations({
    page,
    limit,
    search: debouncedSearch,
    status,
    subscription_tier: tier,
  });

  const { mutate: enableMutate } = useEnableOrganization();
  const { mutate: deleteMutate } = useDeleteOrganization();
  const { mutate: updateMutate } = useUpdateOrganization();

  const handleAction = useMutationAction(null, {
    onSuccess: () => refetch()
  });

  const performAction = (type, payload) => {
    const actions = {
      delete: () => deleteMutate(payload),
      enable: () => enableMutate(payload),
      update: () => updateMutate({ id: payload.id, data: payload.data })
    };
    actions[type]?.();
  };

  const handlePageChange = (newPage, newLimit) => {
    if (newLimit && newLimit !== limit) {
      setLimit(newLimit);
      setPage(1);
    } else {
      setPage(newPage);
    }
  };

  return {
    loading,
    organizations: data?.organizations || [],
    pagination: data?.pagination || { total: 0, pages: 1, limit: limit },
    page,
    limit,
    setPage: handlePageChange,
    search,
    setSearch,
    status,
    setStatus,
    tier,
    setTier,
    dateRange,
    setDateRange,
    performAction,
    refetch
  };
}
