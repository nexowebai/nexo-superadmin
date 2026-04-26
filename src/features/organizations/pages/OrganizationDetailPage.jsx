import React from "react";
import { Button } from "@components/ui";
import { PageContainer } from "@components/layout";
import { RefreshCcw } from "lucide-react";

// Feature Components
import OrgHero from "../components/OrgHero";
import OrgInfo from "../components/OrgInfo";
import OrgSidebar from "../components/OrgSidebar";
import OrgCharts from "../components/OrgCharts";
import OrgStatsOverview from "../components/OrgStatsOverview";
import OrgDetailSkeleton from "../components/skeletons/OrgDetailSkeleton";

// Modals
import {
  DisableOrgModal,
  ResetPasswordModal,
  SendNotificationModal,
  ManageCouponsModal,
  ManagePlanModal,
  AuditLogModal,
} from "../components/OrgModals";
import { ConfirmModal } from "@components/ui";

import useOrgDetail from "../hooks/useOrgDetail.jsx";

export default function OrganizationDetailPage() {
  const {
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
  } = useOrgDetail();

  // Loading State
  if (isLoading) {
    return (
      <PageContainer>
        <OrgDetailSkeleton />
      </PageContainer>
    );
  }

  // Error State
  if (isError || !org) {
    return (
      <PageContainer>
        <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-surface border border-base rounded-xl text-center">
          <RefreshCcw
            size={32}
            className="text-red-500 animate-spin-slow mb-6"
          />
          <h2 className="text-xl font-black text-primary mb-2 uppercase tracking-tighter">
            Synchronize Failed
          </h2>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="mt-4 px-8 font-black uppercase tracking-widest text-xs"
          >
            Retry Initialize
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 pb-20">
        {/* Core Identity */}
        <OrgHero
          org={org}
          onEnable={() => openModal("confirm")}
          onDisable={() => openModal("disable")}
          onNotify={() => openModal("notify")}
          onManagePlan={() => openModal("plan")}
          onManageCoupons={() => openModal("coupons")}
        />

        {/* Operational Intelligence */}
        <OrgStatsOverview org={org} />

        {/* Informational Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrgInfo org={org} onResetPassword={() => openModal("reset")} />
          </div>
          <div className="lg:col-span-1">
            <OrgSidebar org={org} />
          </div>
        </div>

        {/* Analytical Intelligence */}
        <OrgCharts
          org={org}
          onAuditLog={() => openModal("audit")}
          onDelete={() => openModal("disable")}
        />
      </div>

      {/* Actionable Modals */}
      <DisableOrgModal
        isOpen={modals.disable}
        onClose={() => closeModal("disable")}
        orgName={org.name}
        orgId={org.id}
        onSuccess={handleDisableSuccess}
      />

      <ConfirmModal
        isOpen={modals.confirm}
        onClose={() => closeModal("confirm")}
        onConfirm={handleEnable}
        title="Enable Organization"
        description={`Are you sure you want to re-enable ${org.name}? This will restore access for all users immediately.`}
        variant="success"
        confirmText="Enable Access"
      />

      <ResetPasswordModal
        isOpen={modals.reset}
        onClose={() => closeModal("reset")}
        adminEmail={org.admin?.email}
      />

      <SendNotificationModal
        isOpen={modals.notify}
        onClose={() => closeModal("notify")}
        orgName={org.name}
      />

      <ManageCouponsModal
        isOpen={modals.coupons}
        onClose={() => closeModal("coupons")}
        orgName={org.name}
      />

      <ManagePlanModal
        isOpen={modals.plan}
        onClose={() => closeModal("plan")}
        orgName={org.name}
        orgId={org.id}
        currentPlan={org.subscription_tier}
        onSuccess={() => refetch()}
      />

      <AuditLogModal
        isOpen={modals.audit}
        onClose={() => closeModal("audit")}
        orgName={org.name}
      />
    </PageContainer>
  );
}
