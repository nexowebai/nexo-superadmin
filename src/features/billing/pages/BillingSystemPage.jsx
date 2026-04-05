import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Tabs, Button } from "@components/ui";
import { useLayout } from "@context";
import { useBillingPage } from "../hooks/useBillingPage";
import {
  TAB_OPTIONS,
  MOCK_PLANS,
  MOCK_COUPONS,
} from "../constants/billingData";
import { BillingTables } from "../components/BillingTables";
import { PlanModal } from "../components/modals/PlanModal";
import { CouponModal } from "../components/modals/CouponModal";
import { ConfirmModal } from "@components/ui/Modal";
import notify from "@utils/notify";

import "./BillingSystem.css";

export default function BillingSystemPage() {
  const { setHeaderProps } = useLayout();
  const {
    activeTab,
    setActiveTab,
    isPlanModalOpen,
    setIsPlanModalOpen,
    isCouponModalOpen,
    setIsCouponModalOpen,
    billingCycle,
    setBillingCycle,
    discountType,
    setDiscountType,
    couponDuration,
    setCouponDuration,
    copyToClipboard,
    handleCreateClick,
  } = useBillingPage();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: "", name: "", id: null });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleDeletePlan = useCallback((plan) => {
    setDeleteModal({ isOpen: true, type: "Plan", name: plan.name, id: plan.id });
  }, []);

  const handleDeleteCoupon = useCallback((coupon) => {
    setDeleteModal({ isOpen: true, type: "Coupon", name: coupon.code, id: coupon.id });
  }, []);

  const handleConfirmDelete = () => {
    notify.success(`${deleteModal.type} deleted successfully`);
    setDeleteModal({ isOpen: false, type: "", name: "", id: null });
  };

  useEffect(() => {
    setHeaderProps({
      title: "Monetization & Billing",
      action: (
        <Button variant="primary" icon={Plus} onClick={handleCreateClick}>
          {activeTab === "plans" ? "Create Plan" : "Generate Coupon"}
        </Button>
      ),
    });
  }, [setHeaderProps, activeTab, handleCreateClick]);

  return (
    <PageContainer className="billing-v2 pb-12">
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <Tabs options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} />
        </div>

        <BillingTables
          activeTab={activeTab}
          plans={MOCK_PLANS}
          coupons={MOCK_COUPONS}
          onCopy={copyToClipboard}
          onViewPlan={(p) => {
            setSelectedPlan(p);
            setIsPlanModalOpen(true);
          }}
          onDeletePlan={handleDeletePlan}
          onViewCoupon={(c) => {
            setSelectedCoupon(c);
            setIsCouponModalOpen(true);
          }}
          onDeleteCoupon={handleDeleteCoupon}
        />
      </div>

      <PlanModal
        key={selectedPlan?.id || "new-plan"}
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        initialData={selectedPlan}
      />

      <CouponModal
        key={selectedCoupon?.id || "new-coupon"}
        isOpen={isCouponModalOpen}
        onClose={() => {
          setIsCouponModalOpen(false);
          setSelectedCoupon(null);
        }}
        discountType={discountType}
        setDiscountType={setDiscountType}
        couponDuration={couponDuration}
        setCouponDuration={setCouponDuration}
        initialData={selectedCoupon}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: "", name: "", id: null })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteModal.type}`}
        description={`Are you sure you want to delete the ${deleteModal.type.toLowerCase()} "${deleteModal.name}"? This action cannot be undone.`}
        confirmText="Confirm Delete"
        variant="logout"
      />
    </PageContainer>
  );
}
