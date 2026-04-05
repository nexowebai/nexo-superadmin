import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
  Select,
} from "@components/ui";
import notify from "@utils/notify";

export function CouponModal({
  isOpen,
  onClose,
  discountType,
  setDiscountType,
  initialData,
}) {
  const isEdit = !!initialData;
  const [code, setCode] = useState(initialData?.code || "");
  const [amount, setAmount] = useState(initialData?.value || "");

  const handleAction = () => {
    if (!code.toString().trim()) {
      notify.error("Please enter a coupon code");
      return;
    }
    notify.success(isEdit ? "Coupon updated successfully" : "Coupon created successfully");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <ModalHeader>
        <div className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--primary text-info">
            <Sparkles size={20} />
          </div>
          <div>
            <ModalTitle>{isEdit ? "Update Coupon" : "Create Coupon"}</ModalTitle>
            <ModalDescription>
              {isEdit ? `Adjusting parameters for ${initialData.code}` : "Generate a discount coupon for organizations"}
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className="space-y-5">
        <div className="form-field-v2">
          <label>Coupon Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. SUMMER50"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
            disabled={isEdit}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-field-v2">
            <label>Discount Type</label>
            <Select
              options={[
                { label: "Percentage (%)", value: "percentage" },
                { label: "Fixed Amount ($)", value: "fixed" },
              ]}
              value={isEdit ? (initialData.type || "percentage") : discountType}
              onChange={setDiscountType}
            />
          </div>
          <div className="form-field-v2">
            <label>
              {(isEdit ? initialData.type : discountType) === "percentage" ? "Discount (%)" : "Discount ($)"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={(isEdit ? initialData.type : discountType) === "percentage" ? "20" : "100"}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="modal-form-footer">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAction} fullWidth>
            {isEdit ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default CouponModal;
