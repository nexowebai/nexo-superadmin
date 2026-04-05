import { useState } from "react";
import {
  Building2,
  MessageSquare,
  Mail,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
  StatusBadge,
} from "@components/ui";
import { formatDate } from "@utils/format";
import notify from "@utils/notify";

const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="modal-detail-item">
    <span className="modal-detail-item__label">{label}</span>
    <div className="modal-detail-item__value">
      {Icon && <Icon size={14} className="text-muted" />}
      <span>{value}</span>
    </div>
  </div>
);

export function RequestDetailsModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) {
  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <ModalHeader className="modal-form-header">
        <div className="modal-form-header__icon ds-icon-bg--primary">
          <Building2 size={20} />
        </div>
        <div className="modal-form-header__content">
          <ModalTitle>Request Information</ModalTitle>
          <ModalDescription>
            Onboarding request for <span className="font-bold text-primary">{request.organization_name}</span>
          </ModalDescription>
        </div>
      </ModalHeader>
      <ModalBody className="space-y-6">
        <div className="modal-detail-grid">
          <DetailItem
            label="Status"
            value={<StatusBadge status={request.status} size="sm" />}
          />
          <DetailItem
            label="Submitted"
            value={formatDate(request.created_at)}
            icon={Calendar}
          />
          <DetailItem
            label="Contact Point"
            value={request.contact_email}
            icon={Mail}
          />
        </div>

        <div className="bg-bg-elevated rounded-md p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-muted" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">
              Applicant Message
            </span>
          </div>
          <p className="text-sm font-medium text-primary leading-relaxed m-0 italic">
            "{request.message || "The applicant did not provide a message."}"
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="modal-form-footer">
          {request.status === "pending" ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  onReject(request);
                }}
                fullWidth
                style={{ height: "3rem" }}
              >
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  onApprove(request);
                  onClose();
                }}
                fullWidth
                style={{ height: "3rem" }}
              >
                Approve
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={onClose}
              fullWidth
              style={{ height: "3rem" }}
            >
              Close
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}

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
          <div className="modal-form-header__icon ds-icon-bg--error">
            <ShieldAlert size={20} />
          </div>
          <div className="modal-form-header__content">
            <ModalTitle>Deny Access Request</ModalTitle>
            <ModalDescription>
              Reviewing: <span className="font-bold text-primary">{request.organization_name}</span>
            </ModalDescription>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="bg-rose-50/50 border border-rose-100 rounded-md p-4 text-xs font-bold text-rose-700 leading-relaxed uppercase tracking-wide">
            Warning: This action will permanently decline this organization's
            entry request.
          </div>

          <div className="form-field-v2">
            <label>Rejection Rationale</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this request is being denied..."
              rows={4}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="modal-form-footer">
            <Button
              variant="ghost"
              onClick={onClose}
              type="button"
              fullWidth
              style={{ height: "3rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              fullWidth
              style={{ height: "3rem" }}
            >
              Decline Access
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
