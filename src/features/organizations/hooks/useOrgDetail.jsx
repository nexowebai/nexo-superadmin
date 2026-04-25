import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orgService } from "../services/orgService";
import { useLayout } from "@context";
import { Settings } from "lucide-react";
import React from "react";
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

  const openModal = useCallback((type) => setModals((prev) => ({ ...prev, [type]: true })), []);
  const closeModal = useCallback((type) => setModals((prev) => ({ ...prev, [type]: false })), []);

  useEffect(() => {
    setHeaderProps({
      title: "Organization Intelligence",
      backPath: "/organizations",
      action: (
        <Button
          variant="secondary"
          size="sm"
          icon={Settings}
          className="font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-slate-800"
        >
          Config
        </Button>
      )
    });
  }, [setHeaderProps]);

  return {
    org,
    isLoading,
    isError,
    refetch,
    modals,
    openModal,
    closeModal,
    navigate,
    id
  };
};

export default useOrgDetail;
