import { useState } from "react";
import { CreditCard } from "lucide-react";
import notify from "@utils/notify";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button, Select } from "@components/ui";
import "../../styles/modals.css";

export function ManagePlanModal({ isOpen, onClose, orgName, currentPlan, onSuccess }) {
  const [tier, setTier] = useState(currentPlan || "professional");
  const [maxUsers, setMaxUsers] = useState(100);
  const [maxProjects, setMaxProjects] = useState(20);

  const handleUpdate = (e) => {
    if (e) e.preventDefault();
    notify.success("Subscription plan updated successfully");
    onSuccess?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <form onSubmit={handleUpdate}>
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--primary"><CreditCard size={20} /></div>
          <div className="modal-form-header__content">
            <ModalTitle>Manage Subscription</ModalTitle>
            <ModalDescription>Refining plan details for <span className="font-bold text-primary">{orgName}</span></ModalDescription>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="form-field-v2">
            <label>Subscription Tier</label>
            <Select
              options={[
                { label: "Basic Plan", value: "basic" },
                { label: "Professional Plan", value: "professional" },
                { label: "Enterprise Plan", value: "enterprise" },
              ]}
              value={tier}
              onChange={setTier}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="form-field-v2">
              <label>Max Users</label>
              <input type="number" value={maxUsers} onChange={(e) => setMaxUsers(e.target.value)} className="ds-input" />
            </div>
            <div className="form-field-v2">
              <label>Max Projects</label>
              <input type="number" value={maxProjects} onChange={(e) => setMaxProjects(e.target.value)} className="ds-input" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="modal-form-footer">
            <Button variant="secondary" onClick={onClose} type="button" className="px-6 h-11">Cancel</Button>
            <Button variant="primary" type="submit" className="px-8 h-11">Save Configuration</Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default ManagePlanModal;
