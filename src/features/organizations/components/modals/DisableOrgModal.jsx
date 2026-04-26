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
            <ul className="space-y-3 pt-1">
              <li
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: "var(--error)",
                    boxShadow: "0 0 6px var(--error)",
                  }}
                />
                All active user sessions will be terminated immediately.
              </li>
              <li
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: "var(--error)",
                    boxShadow: "0 0 6px var(--error)",
                  }}
                />
                Automated background processes and tasks will be paused.
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
              className="flex-1 h-12"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              className="flex-1 h-12"
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
