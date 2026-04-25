import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useOrganization,
  useEnableOrganization,
  useDeleteOrganization,
} from "./useOrganizations";
import notify from "@utils/notify";

export function useOrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modals, setModals] = useState({
    reset: false,
    disable: false,
    delete: false,
    notify: false,
    coupons: false,
    plan: false,
  });

  const { data: org, isLoading: loading, refetch } = useOrganization(id);
  const { mutateAsync: enableOrg } = useEnableOrganization();
  const { mutateAsync: deleteOrg } = useDeleteOrganization();

  const openModal = useCallback((type) => {
    setModals((prev) => ({ ...prev, [type]: true }));
  }, []);

  const closeModal = useCallback((type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
  }, []);

  const handleEnable = useCallback(async () => {
    try {
      await notify.promise(enableOrg(id), {
        loading: "Enabling organization...",
        success: "Organization enabled successfully",
        error: "Failed to enable organization",
      });
      refetch();
    } catch (error) {
      // Handled by notify.promise
    }
  }, [id, enableOrg, refetch]);

  const handleDelete = useCallback(async () => {
    try {
      await notify.promise(deleteOrg(id), {
        loading: "Deleting organization...",
        success: "Organization deleted successfully",
        error: "Failed to delete organization",
      });
      navigate("/organizations");
    } catch (error) {
      // Handled by notify.promise
    }
  }, [id, deleteOrg, navigate]);

  return {
    org,
    loading,
    modals,
    openModal,
    closeModal,
    handleEnable,
    handleDelete,
    refetch,
    navigate,
  };
}
