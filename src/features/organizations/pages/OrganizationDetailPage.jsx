import { useEffect } from "react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { ConfirmModal } from "@components/ui";
import { useOrganizationDetail } from "../hooks/useOrganizationDetail";
import OrgHero from "../components/OrgHero";
import OrgStats from "../components/OrgStats";
import OrgInfo from "../components/OrgInfo";
import OrgSidebar from "../components/OrgSidebar";
import OrgSkeleton from "../components/OrgSkeleton";
import {
  DisableOrgModal,
  ResetPasswordModal,
  SendNotificationModal,
  ManageCouponsModal,
  ManagePlanModal,
} from "../components/OrgModals";
import { useLayout } from "@context";
import "../styles/organizations.css";

function OrganizationDetailPage() {
  const { setHeaderProps } = useLayout();
  const {
    org,
    loading,
    modals,
    openModal,
    closeModal,
    handleEnable,
    handleDelete,
    refetch,
    navigate,
  } = useOrganizationDetail();

  useEffect(() => {
    if (org) {
      setHeaderProps({
        title: org.name,
        action: null,
      });
    }
  }, [setHeaderProps, org]);

  if (loading) return <OrgSkeleton />;

  return (
    <PageContainer>
      <div className="org-detail">
        <OrgHero
          org={org}
          onEnable={handleEnable}
          onDisable={() => openModal("disable")}
          onNotify={() => openModal("notify")}
          onManagePlan={() => openModal("plan")}
          onManageCoupons={() => openModal("coupons")}
        />

        <OrgStats org={org} />

        <div className="org-content-grid">
          <OrgInfo org={org} onResetPassword={() => openModal("reset")} />

          <OrgSidebar
            org={org}
            onResetPassword={() => openModal("reset")}
            onDelete={() => openModal("delete")}
          />
        </div>
      </div>

      <ResetPasswordModal
        isOpen={modals.reset}
        onClose={() => closeModal("reset")}
        orgId={org.id}
        onSuccess={() => refetch()}
      />

      <DisableOrgModal
        isOpen={modals.disable}
        onClose={() => closeModal("disable")}
        orgId={org.id}
        orgName={org.name}
        onSuccess={() => refetch()}
      />

      <ConfirmModal
        isOpen={modals.delete}
        onClose={() => closeModal("delete")}
        onConfirm={handleDelete}
        title="Delete Organization"
        description={`Are you sure you want to delete "${org.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="delete"
      />

      <SendNotificationModal
        isOpen={modals.notify}
        onClose={() => closeModal("notify")}
        orgName={org.name}
        orgId={org.id}
      />

      <ManageCouponsModal
        isOpen={modals.coupons}
        onClose={() => closeModal("coupons")}
        orgName={org.name}
        orgId={org.id}
      />

      <ManagePlanModal
        isOpen={modals.plan}
        onClose={() => closeModal("plan")}
        orgName={org.name}
        orgId={org.id}
        currentPlan={org.subscription_tier}
        onSuccess={() => refetch()}
      />
    </PageContainer>
  );
}

export default OrganizationDetailPage;
