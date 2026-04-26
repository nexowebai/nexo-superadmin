import { useState } from "react";
import { Tag } from "lucide-react";
import {
  Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter,
  Button, ConfirmModal
} from "@components/ui";
import { CouponListView } from "./CouponListView";
import { CouponAssignView } from "./CouponAssignView";
import "../../styles/modals.css";

const MOCK_AVAILABLE_COUPONS = [
  { id: "v1", code: "SUMMER2024", discount: "20%", type: "Monthly" },
  { id: "v2", code: "PLATINUM_VIP", discount: "$500", type: "Yearly" },
  { id: "v3", code: "GROWTH_BOOST", discount: "15%", type: "Monthly" },
  { id: "v4", code: "LEGACY_DISCOUNT", discount: "10%", type: "Yearly" },
];

const CouponSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-xl border animate-pulse org-skeleton-card">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg border bg-subtle border-base" />
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-subtle" />
        <div className="h-3 w-32 rounded bg-subtle" />
      </div>
    </div>
    <div className="h-9 w-20 rounded-lg bg-subtle" />
  </div>
);

export function ManageCouponsModal({ isOpen, onClose, orgName }) {
  const [view, setView] = useState("list");
  const [isSwitching, setIsSwitching] = useState(false);
  const [filter, setFilter] = useState("all");
  const [coupons, setCoupons] = useState([{ id: "1", code: "WELCOME50", discount: "50%", expiry: "2025-12-31" }]);
  const [confirmRevoke, setConfirmRevoke] = useState({ isOpen: false, coupon: null });

  const handleSwitchView = (v) => {
    setIsSwitching(true);
    setTimeout(() => { setView(v); setIsSwitching(false); }, 800);
  };

  const executeRevoke = () => {
    setCoupons((prev) => prev.filter((c) => c.id !== confirmRevoke.coupon.id));
    setConfirmRevoke({ isOpen: false, coupon: null });
  };

  const handleAddCoupon = (coupon) => {
    if (coupons.find((c) => c.code === coupon.code)) return;
    setCoupons((prev) => [...prev, { ...coupon, expiry: "2025-12-31" }]);
    handleSwitchView("list");
  };

  const filteredAvailable = MOCK_AVAILABLE_COUPONS.filter((c) => filter === "all" || c.type.toLowerCase() === filter);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex flex-col bg-surface">
          <ModalHeader className="modal-form-header">
            <div className="modal-form-header__icon ds-icon-bg--info"><Tag size={20} className="text-info" /></div>
            <div className="modal-form-header__content">
              <ModalTitle className="text-lg font-semibold tracking-tight text-primary">Coupon Management</ModalTitle>
              <ModalDescription className="text-sm font-normal text-secondary">
                Manage discounts for <span className="font-semibold text-primary">{orgName}</span>
              </ModalDescription>
            </div>
          </ModalHeader>

          <ModalBody className="flex-1 pt-4">
            {isSwitching ? (
              <div className="space-y-4"><CouponSkeleton /><CouponSkeleton /><CouponSkeleton /></div>
            ) : view === "list" ? (
              <CouponListView
                coupons={coupons}
                onAssign={() => handleSwitchView("assign")}
                onRevoke={(c) => setConfirmRevoke({ isOpen: true, coupon: c })}
              />
            ) : (
              <CouponAssignView
                filter={filter}
                setFilter={setFilter}
                available={filteredAvailable}
                assigned={coupons}
                onBack={() => handleSwitchView("list")}
                onAdd={handleAddCoupon}
              />
            )}
          </ModalBody>

          <ModalFooter className="p-0 border-t border-base">
            <div className="flex gap-3 w-full p-6 bg-elevated">
              <Button variant="secondary" onClick={onClose} className="font-semibold text-xs h-11 px-6">Close</Button>
              <Button variant="primary" onClick={onClose} className="font-semibold text-xs h-11 px-8">Finish Configuration</Button>
            </div>
          </ModalFooter>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmRevoke.isOpen} onClose={() => setConfirmRevoke({ isOpen: false, coupon: null })}
        onConfirm={executeRevoke} title="Revoke Coupon" variant="delete" confirmText="Revoke"
        description={`Revoke "${confirmRevoke.coupon?.code}" from ${orgName}?`}
      />
    </>
  );
}

export default ManageCouponsModal;
