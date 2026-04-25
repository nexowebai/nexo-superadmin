import { useState, useCallback, useMemo } from "react";
import {
  useRequests,
  useApproveRequest,
  useRejectRequest,
} from "./useRequests";
import { MOCK_REQUESTS } from "../constants/requestData";
import notify from "@utils/notify";

export function useRequestsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading: loading,
    refetch,
  } = useRequests({
    page,
    limit,
    status: status || undefined,
    search: search || undefined,
  });

  const { mutate: approveRequest } = useApproveRequest();
  const { mutate: rejectRequest } = useRejectRequest();

  const requests = useMemo(() => {
    // Only show mock data if there's no real data AND no filters are active
    const hasData = data?.requests && data.requests.length > 0;
    const hasFilters = search || status;
    
    if (!hasData && !hasFilters) return MOCK_REQUESTS;
    return data?.requests || [];
  }, [data, search, status]);

  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: requests.length,
    pages: 1,
  };

  const handleApprove = useCallback(
    (req, onSuccess) => {
      notify.promise(
        new Promise((resolve, reject) => {
          approveRequest(req.id, {
            onSuccess: () => {
              refetch();
              onSuccess?.();
              resolve();
            },
            onError: reject,
          });
        }),
        {
          loading: `Approving ${req.organization_name}...`,
          success: `${req.organization_name} approved successfully!`,
          error: (err) => err?.message || "Failed to approve request",
        },
      );
    },
    [approveRequest, refetch],
  );

  const handleReject = useCallback(
    (reqId, reason, onSuccess) => {
      notify.promise(
        new Promise((resolve, reject) => {
          rejectRequest(
            { id: reqId, reason },
            {
              onSuccess: () => {
                refetch();
                onSuccess?.();
                resolve();
              },
              onError: reject,
            },
          );
        }),
        {
          loading: "Rejecting request...",
          success: "Request rejected",
          error: (err) => err?.message || "Failed to reject request",
        },
      );
    },
    [rejectRequest, refetch],
  );

  return {
    loading,
    requests,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    status,
    setStatus,
    search,
    setSearch,
    handleApprove,
    handleReject,
    refetch,
  };
}
