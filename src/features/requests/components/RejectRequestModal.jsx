import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button } from "@components/ui";
import notify from "@utils/notify";

export function RejectRequestModal({ isOpen, onClose, request, onConfirm }) {
  const [reason, setReason] = useState("");

  const handleConfirm = (e) => {
    if (e) e.preventDefault();
    if (!reason.trim()) {
      notify.error("Please provide a reason for rejection");
      return;
    }
    onConfirm(request.id, reason, () => {
      setReason("");
      onClose();
    });
  };

  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <form onSubmit={handleConfirm}>
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--error"><ShieldAlert size={20} /></div>
          <div className="modal-form-header__content">
            <ModalTitle>Deny Access Request</ModalTitle>
            <ModalDescription>Reviewing: <span className="font-bold text-primary">{request.organization_name}</span></ModalDescription>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="bg-rose-50/50 border border-rose-100 rounded-md p-4 text-xs font-bold text-rose-700 leading-relaxed uppercase tracking-wide">
            Warning: This action will permanently decline this organization's entry request.
          </div>
          <div className="form-field-v2">
            <label>Rejection Rationale</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why this request is being denied..." rows={4} autoFocus />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="modal-form-footer">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="danger" type="submit">Decline Access</Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
