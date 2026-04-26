import React from "react";
import { Button } from "@components/ui";
import { PageContainer } from "@components/layout";
import { RefreshCcw } from "lucide-react";
import OrgHero from "../components/detail/OrgHero";
import OrgInfo from "../components/detail/OrgInfo";
import OrgSidebar from "../components/detail/OrgSidebar";
import OrgCharts from "../components/table/OrgCharts";
import OrgStatsOverview from "../components/detail/OrgStatsOverview";
import { OrgDetailSkeleton } from "@components/skeletons";
import { OrgModalContainer } from "../components/modals/OrgModalContainer";
import useOrgDetail from "../hooks/useOrgDetail.jsx";

export default function OrganizationDetailPage() {
  const {
    org, isLoading, isError, refetch, modals, openModal, closeModal,
    handleEnable, handleDisableSuccess,
  } = useOrgDetail();

  if (isLoading) return <PageContainer><OrgDetailSkeleton /></PageContainer>;

  if (isError || !org) return <DetailErrorState onRetry={() => refetch()} />;

  return (
    <PageContainer>
      <div className="space-y-6 pb-20">
        <OrgHero
          org={org} onEnable={() => openModal("confirm")} onDisable={() => openModal("disable")}
          onNotify={() => openModal("notify")} onManagePlan={() => openModal("plan")} onManageCoupons={() => openModal("coupons")}
        />

        <OrgStatsOverview org={org} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrgInfo org={org} onResetPassword={() => openModal("reset")} />
          </div>
          <div className="lg:col-span-1">
            <OrgSidebar org={org} />
          </div>
        </div>

        <OrgCharts org={org} onAuditLog={() => openModal("audit")} onDelete={() => openModal("disable")} />
      </div>

      <OrgModalContainer 
        org={org} modals={modals} closeModal={closeModal} 
        handleEnable={handleEnable} handleDisableSuccess={handleDisableSuccess} refetch={refetch} 
      />
    </PageContainer>
  );
}

function DetailErrorState({ onRetry }) {
  return (
    <PageContainer>
      <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-surface border border-base rounded-xl text-center">
        <RefreshCcw size={32} className="text-red-500 animate-spin-slow mb-6" />
        <h2 className="text-xl font-black text-primary mb-2 uppercase tracking-tighter">Synchronize Failed</h2>
        <Button variant="primary" onClick={onRetry} className="mt-4 px-8 font-black uppercase tracking-widest text-xs">
          Retry Initialize
        </Button>
      </div>
    </PageContainer>
  );
}
