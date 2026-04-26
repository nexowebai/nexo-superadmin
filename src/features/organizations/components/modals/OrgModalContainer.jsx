import React from "react";
import { ConfirmModal } from "@components/ui";
import {
  DisableOrgModal, ResetPasswordModal, SendNotificationModal,
  ManageCouponsModal, ManagePlanModal, AuditLogModal,
} from "./OrgModals";

export function OrgModalContainer({ org, modals, closeModal, handleEnable, handleDisableSuccess, refetch }) {
  if (!org) return null;
  
  return (
    <>
      <DisableOrgModal isOpen={modals.disable} onClose={() => closeModal("disable")} orgName={org.name} orgId={org.id} onSuccess={handleDisableSuccess} />
      
      <ConfirmModal
        isOpen={modals.confirm} onClose={() => closeModal("confirm")} onConfirm={handleEnable}
        title="Enable Organization" variant="success" confirmText="Enable Access"
        description={`Are you sure you want to re-enable ${org.name}? This will restore access for all users immediately.`}
      />

      <ResetPasswordModal isOpen={modals.reset} onClose={() => closeModal("reset")} adminEmail={org.admin?.email} />
      <SendNotificationModal isOpen={modals.notify} onClose={() => closeModal("notify")} orgName={org.name} />
      <ManageCouponsModal isOpen={modals.coupons} onClose={() => closeModal("coupons")} orgName={org.name} />
      
      <ManagePlanModal
        isOpen={modals.plan} onClose={() => closeModal("plan")}
        orgName={org.name} orgId={org.id} currentPlan={org.subscription_tier}
        onSuccess={() => refetch()}
      />

      <AuditLogModal isOpen={modals.audit} onClose={() => closeModal("audit")} orgName={org.name} />
    </>
  );
}
