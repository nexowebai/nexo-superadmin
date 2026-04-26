import { useState } from "react";
import { Tag, Plus, ChevronLeft } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
  ConfirmModal,
  Select,
} from "@components/ui";

const MOCK_AVAILABLE_COUPONS = [
  { id: "v1", code: "SUMMER2024", discount: "20%", type: "Monthly" },
  { id: "v2", code: "PLATINUM_VIP", discount: "$500", type: "Yearly" },
  { id: "v3", code: "GROWTH_BOOST", discount: "15%", type: "Monthly" },
  { id: "v4", code: "LEGACY_DISCOUNT", discount: "10%", type: "Yearly" },
];

const CouponSkeleton = () => (
  <div
    className="flex items-center justify-between p-4 rounded-xl border animate-pulse"
    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-base)" }}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-base)" }} />
      <div className="space-y-2">
        <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
        <div className="h-3 w-32 rounded" style={{ backgroundColor: "var(--bg-elevated)" }} />
      </div>
    </div>
    <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }} />
  </div>
);

export function ManageCouponsModal({ isOpen, onClose, orgName }) {
  const [view, setView] = useState("list");
  const [isSwitching, setIsSwitching] = useState(false);
  const [filter, setFilter] = useState("all");
  const [coupons, setCoupons] = useState([
    { id: "1", code: "WELCOME50", discount: "50%", expiry: "2025-12-31" },
  ]);
  const [confirmRevoke, setConfirmRevoke] = useState({ isOpen: false, coupon: null });

  const handleSwitchView = (newView) => {
    setIsSwitching(true);
    setTimeout(() => {
      setView(newView);
      setIsSwitching(false);
    }, 800);
  };

  const handleRevoke = (coupon) => {
    setConfirmRevoke({ isOpen: true, coupon });
  };

  const executeRevoke = () => {
    setCoupons((prev) => prev.filter((c) => c.id !== confirmRevoke.coupon.id));
    setConfirmRevoke({ isOpen: false, coupon: null });
  };

  const handleAddCoupon = (coupon) => {
    if (coupons.find((c) => c.code === coupon.code)) return;
    setCoupons((prev) => [
      ...prev,
      { ...coupon, expiry: "2025-12-31" },
    ]);
    handleSwitchView("list");
  };

  const filteredAvailable = MOCK_AVAILABLE_COUPONS.filter(c => {
    if (filter === "all") return true;
    return c.type.toLowerCase() === filter;
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex flex-col h-full min-h-[500px]" style={{ fontFamily: 'var(--font-sans)', backgroundColor: "var(--bg-surface)" }}>
          <ModalHeader className="modal-form-header">
            <div className="modal-form-header__icon ds-icon-bg--info">
              <Tag size={20} className="text-info" />
            </div>
            <div className="modal-form-header__content">
              <ModalTitle className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Coupon Management
              </ModalTitle>
              <ModalDescription className="text-sm font-normal" style={{ color: "var(--text-secondary)" }}>
                Manage discounts for <span className="font-semibold text-primary">{orgName}</span>
              </ModalDescription>
            </div>
          </ModalHeader>

          <ModalBody className="flex-1 pt-4">
            {isSwitching ? (
              <div className="space-y-4">
                <CouponSkeleton />
                <CouponSkeleton />
                <CouponSkeleton />
              </div>
            ) : view === "list" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Active Coupons
                  </h4>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    className="px-4 font-semibold text-xs"
                    onClick={() => handleSwitchView("assign")}
                  >
                    Assign New
                  </Button>
                </div>

                <div className="border rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-base)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold border-b text-left" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", borderColor: "var(--border-base)" }}>
                        <th className="p-4">Code</th>
                        <th className="p-4">Discount</th>
                        <th className="p-4">Expiry</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: "var(--text-primary)" }}>
                      {coupons.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-10 text-center italic" style={{ color: "var(--text-muted)" }}>No coupons found</td>
                        </tr>
                      ) : (
                        coupons.map((c) => (
                          <tr key={c.id} className="border-b last:border-0" style={{ borderColor: "var(--border-base)" }}>
                            <td className="p-4 font-medium text-primary">{c.code}</td>
                            <td className="p-4" style={{ color: "var(--text-secondary)" }}>{c.discount}</td>
                            <td className="p-4 opacity-70" style={{ color: "var(--text-muted)" }}>{c.expiry}</td>
                            <td className="p-4 text-right">
                              <Button
                                variant="danger"
                                size="xs"
                                onClick={() => handleRevoke(c)}
                                className="px-3"
                              >
                                Revoke
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ChevronLeft}
                    className="text-xs font-semibold"
                    onClick={() => handleSwitchView("list")}
                  >
                    Back
                  </Button>

                  <Select
                    className="w-48 text-xs"
                    options={[
                      { label: "All Coupons", value: "all" },
                      { label: "Monthly Plan", value: "monthly" },
                      { label: "Yearly Plan", value: "yearly" },
                    ]}
                    value={filter}
                    onChange={setFilter}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {filteredAvailable.map((coupon) => {
                    const isAssigned = coupons.find(c => c.code === coupon.code);
                    return (
                      <div
                        key={coupon.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAssigned ? "opacity-50 grayscale-[0.5]" : "shadow-sm"
                          }`}
                        style={{
                          backgroundColor: isAssigned ? "var(--bg-elevated)" : "var(--bg-surface)",
                          borderColor: "var(--border-base)"
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                            backgroundColor: isAssigned ? "var(--bg-elevated)" : "var(--primary-soft)",
                            color: isAssigned ? "var(--text-muted)" : "var(--primary)"
                          }}>
                            <Tag size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{coupon.code}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{coupon.discount} Off</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{
                                backgroundColor: coupon.type === "Monthly" ? "var(--info-soft)" : "var(--primary-soft)",
                                color: coupon.type === "Monthly" ? "var(--info)" : "var(--primary)"
                              }}>
                                {coupon.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={isAssigned ? "secondary" : "primary"}
                          size="sm"
                          disabled={isAssigned}
                          className="px-6 font-semibold text-xs"
                          onClick={() => handleAddCoupon(coupon)}
                        >
                          {isAssigned ? "Assigned" : "Assign"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <div className="grid grid-cols-2 gap-3 w-full p-6 border-t" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-base)" }}>
              <Button variant="secondary" onClick={onClose} className="font-semibold text-xs h-11">
                Close
              </Button>
              <Button variant="primary" onClick={onClose} className="font-semibold text-xs h-11">
                Finish Configuration
              </Button>
            </div>
          </ModalFooter>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmRevoke.isOpen}
        onClose={() => setConfirmRevoke({ isOpen: false, coupon: null })}
        onConfirm={executeRevoke}
        title="Revoke Coupon"
        description={`Revoke "${confirmRevoke.coupon?.code}" from ${orgName}?`}
        variant="delete"
        confirmText="Revoke"
      />
    </>
  );
}

export default ManageCouponsModal;
