import { useState } from "react";
import { Tag, Plus } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
} from "@components/ui";

export function ManageCouponsModal({ isOpen, onClose, orgName }) {
  const [coupons, setCoupons] = useState([
    { id: "1", code: "WELCOME50", discount: "50%", expiry: "2025-12-31" },
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--info">
            <Tag size={24} className="text-info" />
          </div>
          <div className="ds-modal-header__content">
            <ModalTitle>Coupon Management</ModalTitle>
            <ModalDescription>
              Configure and assign discounts for{" "}
              <span className="font-bold text-primary">{orgName}</span>
            </ModalDescription>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="section-title-nx">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted">
                Active Assignments
              </h4>
            </div>
            <Button variant="primary" size="sm" icon={Plus}>
              Assign New
            </Button>
          </div>

          <div className="border border-base rounded-lg overflow-hidden bg-surface">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bg-elevated text-[10px] font-bold uppercase tracking-widest text-muted border-b border-base text-left">
                  <th className="p-4">Voucher Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Expiry</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base">
                {coupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-12 text-center text-muted text-xs italic"
                    >
                      No coupons assigned
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-bg-elevated transition-colors border-0"
                    >
                      <td className="p-4 font-mono font-bold text-primary">
                        {c.code}
                      </td>
                      <td className="p-4 font-medium text-secondary">
                        {c.discount}
                      </td>
                      <td className="p-4 text-muted font-medium">{c.expiry}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-500/10 border border-red-500 hover:text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() =>
                            setCoupons((prev) =>
                              prev.filter((x) => x.id !== c.id),
                            )
                          }
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
        </ModalBody>
        <ModalFooter className="ds-confirm-modal__footer">
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
            className="ds-confirm-modal__cancel w-full"
          >
            Close
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default ManageCouponsModal;
