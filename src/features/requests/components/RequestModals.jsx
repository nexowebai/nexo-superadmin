import { useState } from 'react';
import { Building2, MessageSquare, Mail, Calendar, Check, X as XIcon } from 'lucide-react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, StatusBadge, ConfirmModal } from '@components/ui';
import { formatDate } from '@utils/format';
import notify from '@utils/notify';

export function RequestDetailsModal({ isOpen, onClose, request, onApprove, onReject }) {
    if (!request) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalHeader>
                <ModalTitle>Request Details</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="req-detail-container">
                    <div className="req-detail-header">
                        <div className="req-detail-icon">
                            <Building2 size={24} />
                        </div>
                        <div className="req-detail-title-group">
                            <h3>{request.organization_name}</h3>
                            <div className="req-detail-subtitle">
                                <Mail size={14} />
                                <span>{request.contact_email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="req-detail-grid">
                        <div className="req-detail-box">
                            <span className="req-detail-box-label">Status</span>
                            <StatusBadge status={request.status} />
                        </div>
                        <div className="req-detail-box">
                            <span className="req-detail-box-label">Submitted On</span>
                            <div className="req-detail-box-value">
                                <Calendar size={14} />
                                <span>{formatDate(request.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="req-detail-message">
                        <span className="req-detail-message-label">
                            <MessageSquare size={14} /> Message
                        </span>
                        <p className="req-detail-message-text">
                            {request.message || 'No additional message provided.'}
                        </p>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="w-full flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    {request.status === 'pending' && (
                        <>
                            <Button variant="danger" icon={XIcon} onClick={() => { onClose(); onReject(request); }}>
                                Reject
                            </Button>
                            <Button variant="success" icon={Check} onClick={() => { onApprove(request); onClose(); }}>
                                Approve
                            </Button>
                        </>
                    )}
                </div>
            </ModalFooter>
        </Modal>
    );
}

export function RejectRequestModal({ isOpen, onClose, request, onConfirm, loading }) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            notify.error('Please provide a reason for rejection');
            return;
        }
        onConfirm(request.id, reason, () => {
            setReason('');
            onClose();
        });
    };

    if (!request) return null;

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="Reject Request"
            description={
                <div className="modal-form-content">
                    <div className="modal-info-box-v2">
                        <Building2 size={24} className="text-primary" />
                        <div>
                            <p className="font-bold text-primary">{request.organization_name}</p>
                            <p className="text-xs text-muted">{request.contact_email}</p>
                        </div>
                    </div>
                    <div className="modal-input-group mt-6">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Reason for rejection</label>
                        <textarea
                            className="w-full bg-surface-base border border-base rounded-md p-3 text-secondary text-sm focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please explain why this request is being rejected..."
                            rows={4}
                        />
                    </div>
                </div>
            }
            confirmText="Confirm Rejection"
            variant="delete"
            loading={loading}
        />
    );
}
