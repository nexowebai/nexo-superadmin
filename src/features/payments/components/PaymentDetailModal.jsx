import React from 'react';
import {
    CreditCard, Building2, XCircle, Download, FileText, Calendar, Hash, ShieldCheck
} from 'lucide-react';
import {
    StatusBadge, Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button
} from '@components/ui';
import { formatCurrency, formatDate } from '@utils/format';

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="modal-detail-item">
        <span className="modal-detail-item__label">{label}</span>
        <div className="modal-detail-item__value">
            {Icon && <Icon size={14} className="text-muted" />}
            <span>{value}</span>
        </div>
    </div>
);

export function PaymentDetailModal({ payment, isOpen, onClose }) {
    if (!payment) return null;

    const isSuccess = payment.status === 'succeeded' || payment.status === 'paid';

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
            <ModalHeader>
                <div className="modal-form-header">
                    <div className={`modal-form-header__icon ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        <Building2 size={20} />
                    </div>
                    <div>
                        <ModalTitle>Payment Receipt</ModalTitle>
                        <ModalDescription>Transaction details for {payment.organization_name}</ModalDescription>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
                <div className="flex flex-col items-center justify-center p-8 bg-bg-elevated rounded-md border border-base relative overflow-hidden">
                    {/* Subtle Background Icon */}
                    <CreditCard size={120} className="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12" />

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-3">Total Settlement Amount</span>
                    <div className="text-5xl font-black text-primary tracking-tighter mb-4">
                        {formatCurrency(payment.amount)}
                    </div>
                    <StatusBadge status={payment.status} size="md" className="font-bold px-4" />
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Transaction Metadata</h4>
                    <div className="modal-detail-grid">
                        <DetailItem label="Invoice ID" value={payment.invoice_id} icon={FileText} />
                        <DetailItem label="Payment Method" value={`${payment.payment_method}${payment.card_last4 ? ` (•••• ${payment.card_last4})` : ''}`} icon={CreditCard} />
                        <DetailItem label="Transaction Date" value={formatDate(payment.created_at)} icon={Calendar} />
                        <DetailItem label="Reference Code" value={payment.id} icon={Hash} />
                        <DetailItem label="Plan Tier" value={payment.plan} icon={ShieldCheck} />
                        <DetailItem label="Settled At" value={payment.paid_at ? formatDate(payment.paid_at) : 'Processing'} icon={Calendar} />
                    </div>
                </div>

                {payment.error_message && (
                    <div className="bg-rose-50 border border-rose-100 rounded-md p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-md bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                            <XCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-800 m-0 mb-1">Authorization Fault</p>
                            <p className="text-sm font-bold text-rose-900 leading-relaxed m-0">{payment.error_message}</p>
                        </div>
                    </div>
                )}
            </ModalBody>

            <ModalFooter>
                <div className="modal-form-footer">
                    <Button variant="secondary" onClick={onClose} fullWidth className="h-11">
                        Close
                    </Button>
                    <Button variant="primary" icon={Download} fullWidth className="h-11">
                        Get Receipt
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}
