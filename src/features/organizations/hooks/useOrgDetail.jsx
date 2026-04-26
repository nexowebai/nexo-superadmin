import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orgService } from "../services/orgService";
import { useLayout } from "@context";
import { Edit } from "lucide-react";
import { Button } from "@components/ui";

export const useOrgDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();

  const [modals, setModals] = useState({
    disable: false,
    reset: false,
    notify: false,
    coupons: false,
    plan: false,
    audit: false,
    confirm: false,
  });

  const {
    data: org,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      const response = await orgService.getById(id);
      return response.data.organization;
    },
    retry: 2,
    staleTime: 30000,
  });

  const openModal = useCallback(
    (type) => setModals((prev) => ({ ...prev, [type]: true })),
    [],
  );
  const closeModal = useCallback(
    (type) => setModals((prev) => ({ ...prev, [type]: false })),
    [],
  );

  const handleEnable = useCallback(async () => {
    try {
      await orgService.update(id, { status: "active" });
      refetch();
      closeModal("confirm");
      notify.success("Organization re-enabled successfully");
    } catch (error) {
      notify.error("Failed to enable organization");
    }
  }, [id, refetch, closeModal]);

  const handleDisableSuccess = useCallback(() => {
    refetch();
    closeModal("disable");
    notify.success("Organization access suspended");
  }, [refetch, closeModal]);

  useEffect(() => {
    setHeaderProps({
      title: "Organization Detail",
      backPath: "/organizations",
      action: (
        <Button
          variant="primary"
          size="md"
          icon={Edit}
          onClick={() => navigate(`/organizations/${id}/edit`)}
          className="font-black uppercase tracking-widest text-[10px]"
        >
          Edit Organization
        </Button>
      ),
    });

    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps]);

  return {
    org,
    isLoading,
    isError,
    refetch,
    modals,
    openModal,
    closeModal,
    handleEnable,
    handleDisableSuccess,
    navigate,
    id,
  };
};

export default useOrgDetail;
