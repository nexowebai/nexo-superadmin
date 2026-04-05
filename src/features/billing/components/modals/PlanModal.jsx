import { Rocket } from "lucide-react";
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

export function PlanModal({
  isOpen,
  onClose,
  billingCycle,
  setBillingCycle,
  initialData,
}) {
  const isEdit = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <ModalHeader>
        <div className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--primary text-primary">
            <Rocket size={20} />
          </div>
          <div>
            <ModalTitle>
              {isEdit ? "Update Plan" : "Create New Plan"}
            </ModalTitle>
            <ModalDescription>
              {isEdit
                ? `Modifying configuration for ${initialData.name}`
                : "Set up a new subscription plan for organizations"}
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className="space-y-5">
        <div className="form-field-v2">
          <label>Plan Name</label>
          <input
            type="text"
            defaultValue={initialData?.name}
            placeholder="e.g. Enterprise Plus"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-field-v2">
            <label>Base Price ($)</label>
            <input
              type="number"
              defaultValue={initialData?.price}
              placeholder="99.00"
            />
          </div>
          <div className="form-field-v2">
            <label>Billing Cycle</label>
            <Select
              options={[
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ]}
              value={initialData?.billing_cycle || billingCycle}
              onChange={setBillingCycle}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-field-v2">
            <label>Max Projects</label>
            <input
              type="number"
              defaultValue={initialData?.base_projects}
              placeholder="20"
            />
          </div>
          <div className="form-field-v2">
            <label>Extra Cost Per Unit ($)</label>
            <input
              type="number"
              defaultValue={initialData?.extra_project_cost}
              placeholder="5.00"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="modal-form-footer">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              notify.success(isEdit ? "Plan updated" : "Plan created");
              onClose();
            }}
            fullWidth
          >
            {isEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default PlanModal;
