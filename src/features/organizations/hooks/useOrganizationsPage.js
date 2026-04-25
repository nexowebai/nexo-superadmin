import { useState, useCallback, useMemo } from "react";
import {
  useOrganizations,
  useEnableOrganization,
  useDeleteOrganization,
  useUpdateOrganization,
} from "./useOrganizations";
import { MOCK_ORGANIZATIONS } from "../constants/organizationData";
import { useMutationAction } from "@hooks";

export function useOrganizationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tier, setTier] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const {
    data,
    isLoading: loading,
    refetch,
  } = useOrganizations({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
    subscription_tier: tier || undefined,
  });

  const { mutate: enableOrgMutate } = useEnableOrganization();
  const { mutate: deleteOrgMutate } = useDeleteOrganization();
  const { mutate: updateOrgMutate } = useUpdateOrganization();

  const organizations = useMemo(() => {
    const hasData = data && data.organizations && data.organizations.length > 0;
    return hasData ? data.organizations : MOCK_ORGANIZATIONS;
  }, [data]);

  const pagination = (data && data.pagination) || {
    page,
    limit: 10,
    total: organizations.length,
    pages: 1,
  };

  const handlePageChange = useCallback((newPage) => setPage(newPage), []);

  const messages = {
    delete: {
      loading: "Deleting organization...",
      success: "Organization deleted!",
      error: "Failed to delete",
    },
    enable: {
      loading: "Enabling organization...",
      success: "Organization enabled!",
      error: "Failed to enable",
    },
    update: {
      loading: "Updating status...",
      success: "Status updated!",
      error: "Failed",
    },
  };

  const deleteOrg = useMutationAction(deleteOrgMutate, {
    messages: messages.delete,
    onSuccess: () => refetch(),
  });

  const enableOrg = useMutationAction(enableOrgMutate, {
    messages: messages.enable,
    onSuccess: () => refetch(),
  });

  const updateOrg = useMutationAction(updateOrgMutate, {
    messages: messages.update,
    onSuccess: () => refetch(),
  });

  const handleAction = useCallback(
    (type, id) => {
      if (type === "delete") deleteOrg(id);
      else if (type === "enable") enableOrg(id);
      else if (type === "update") updateOrg({ id: id.id, data: id.data });
    },
    [deleteOrg, enableOrg, updateOrg],
  );

  return {
    loading,
    organizations,
    pagination,
    page,
    setPage: handlePageChange,
    search,
    setSearch,
    status,
    setStatus,
    tier,
    setTier,
    dateRange,
    setDateRange,
    handleAction,
    refetch,
  };
}
