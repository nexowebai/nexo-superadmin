import { useState, useCallback } from "react";
import { KeyRound } from "lucide-react";
import notify from "@utils/notify";
import { useResetOrgPassword } from "../../hooks/useOrganizations";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
} from "@components/ui";

export function ResetPasswordModal({ isOpen, onClose, orgId, onSuccess }) {
  const [password, setPassword] = useState("");
  const { mutate: resetPassword } = useResetOrgPassword();

  const handleReset = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (!password || password.length < 8) {
        notify.error("Password must be at least 8 characters");
        return;
      }
      onClose();
      notify.promise(
        new Promise((resolve, reject) => {
          resetPassword(
            { id: orgId, password },
            {
              onSuccess: () => {
                setPassword("");
                onSuccess?.();
                resolve();
              },
              onError: reject,
            },
          );
        }),
        {
          loading: "Resetting password...",
          success: "Password reset successfully!",
          error: "Failed to reset password",
        },
      );
    },
    [orgId, password, resetPassword, onClose, onSuccess],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setPassword("");
      }}
      size="md"
      showCloseButton
    >
      <form onSubmit={handleReset}>
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--warning">
            <KeyRound size={20} />
          </div>
          <div className="modal-form-header__content">
            <ModalTitle>Reset Admin Password</ModalTitle>
            <ModalDescription>
              Enter a new secure password for the organization administrator.
            </ModalDescription>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="form-field-v2">
            <label>New Secure Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="ds-input"
              autoFocus
              autoComplete="off"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="modal-form-footer">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
              fullWidth
              style={{ height: "48px" }}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              type="submit"
              fullWidth
              style={{ height: "48px" }}
            >
              Set New Password
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default ResetPasswordModal;
