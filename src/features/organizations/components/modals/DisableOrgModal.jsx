import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@components/ui";

export default function DisableOrgModal({
  isOpen,
  onClose,
  orgId,
  orgName,
  onSuccess,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDisable = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API CALL MOCK
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <form onSubmit={handleDisable}>
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--danger">
            <ShieldAlert size={20} className="text-error" />
          </div>
          <div className="modal-form-header__content">
            <ModalTitle>Disable Organization</ModalTitle>
            <ModalDescription>
              Confirming this action for{" "}
              <span className="font-bold text-primary">{orgName}</span>
            </ModalDescription>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="bg-elevated p-4 rounded-lg border border-base space-y-3">
            <p className="text-sm text-secondary leading-relaxed">
              Disabling this organization will immediately revoke access for all
              its users. They will not be able to log in until the organization
              is re-enabled.
            </p>
            <ul className="space-y-2 text-xs text-muted">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-error" />
                All active sessions will be terminated
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-error" />
                Scheduled tasks will be paused
              </li>
            </ul>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="modal-form-footer">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              className="flex-1"
              style={{ height: "3rem" }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              className="flex-1"
              style={{ height: "3rem" }}
              loading={loading}
            >
              Disable Organization
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
