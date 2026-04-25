import { useState } from "react";
import { Tag, Plus, X } from "lucide-react";
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="flex flex-col h-full"
      >
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--info">
            <Tag size={20} className="text-info" />
          </div>
          <div className="ds-modal-header__content">
            <ModalTitle>Coupon Management</ModalTitle>
            <ModalDescription className="text-xs font-bold text-slate-400 uppercase tracking-tight">
              Configure and assign discounts for <span className="font-bold text-primary">{orgName}</span>
            </ModalDescription>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Active Assignments
            </h4>
            <Button variant="primary" size="sm" icon={Plus} className="h-9 px-4 font-black uppercase tracking-widest text-[10px]">
              Assign New
            </Button>
          </div>

          <div className="border border-base rounded-lg overflow-hidden bg-surface shadow-sm">
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
                      className="p-12 text-center text-muted text-xs font-bold italic"
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
                      <td className="p-4 text-muted font-medium tabular-nums">{c.expiry}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-500/10 border border-red-200 dark:border-red-900/50 transition-all font-black uppercase text-[10px] tracking-widest"
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

        <ModalFooter className="modal-form-footer flex justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            icon={X}
            className="px-8 font-black tracking-[0.2em] uppercase text-xs border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            style={{ height: "3rem" }}
          >
            Close
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default ManageCouponsModal;
