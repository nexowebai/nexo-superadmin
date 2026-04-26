import React from "react";
import { Building2, MessageSquare, Mail, Calendar } from "lucide-react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button, StatusBadge } from "@components/ui";
import { formatDate } from "@utils/format";

export function RequestDetailsModal({ isOpen, onClose, request, onApprove, onReject }) {
  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
      <ModalHeader className="modal-form-header">
        <div className="modal-form-header__icon ds-icon-bg--primary"><Building2 size={20} /></div>
        <div className="modal-form-header__content">
          <ModalTitle>Request Information</ModalTitle>
          <ModalDescription>Onboarding request for <span className="font-bold text-primary">{request.organization_name}</span></ModalDescription>
        </div>
      </ModalHeader>
      <ModalBody className="space-y-6">
        <div className="modal-detail-grid">
          <DetailItem label="Status" value={<StatusBadge status={request.status} size="sm" />} />
          <DetailItem label="Submitted" value={formatDate(request.created_at)} icon={Calendar} />
          <DetailItem label="Contact Point" value={request.contact_email} icon={Mail} />
        </div>
        <ApplicantMessage message={request.message} />
      </ModalBody>
      <ModalFooter>
        <div className="modal-form-footer">
          {request.status === "pending" ? (
            <PendingActions onReject={() => { onClose(); onReject(request); }} onApprove={() => { onApprove(request); onClose(); }} />
          ) : (
            <Button variant="secondary" onClick={onClose}>Close Details</Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="modal-detail-item">
      <span className="modal-detail-item__label">{label}</span>
      <div className="modal-detail-item__value">
        {Icon && <Icon size={14} className="text-muted" />}
        <span>{value}</span>
      </div>
    </div>
  );
}

function ApplicantMessage({ message }) {
  return (
    <div className="bg-bg-elevated rounded-md p-5 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare size={14} className="text-muted" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Applicant Message</span>
      </div>
      <p className="text-sm font-medium text-primary leading-relaxed m-0 italic">"{message || "The applicant did not provide a message."}"</p>
    </div>
  );
}

function PendingActions({ onReject, onApprove }) {
  return (
    <>
      <Button variant="secondary" onClick={onReject}>Reject Request</Button>
      <Button variant="primary" onClick={onApprove}>Approve Request</Button>
    </>
  );
}
