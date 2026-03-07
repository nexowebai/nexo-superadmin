import React from 'react';
import {
    CreditCard, Building2, XCircle, Download
} from 'lucide-react';
import { StatusBadge, Modal, ModalHeader, ModalTitle, ModalBody, Button } from '@components/ui';
import { formatCurrency, formatDate } from '@utils/format';

const ReceiptItem = ({ label, value }) => (
    <div className="receipt-item">
        <span className="receipt-item-label">{label}</span>
        <span className="receipt-item-value">{value}</span>
    </div>
);

export function PaymentDetailModal({ payment, isOpen, onClose }) {
    if (!payment) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="payment-receipt-content">
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-base">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary m-0 mb-0.5">{payment.organization_name}</h3>
                                <p className="text-[10px] font-mono font-bold text-muted m-0 uppercase tracking-widest">{payment.org_code} • {payment.id}</p>
                            </div>
                        </div>
                        <StatusBadge status={payment.status} size="sm" />
                    </div>

                    <div className="receipt-amount-section">
                        <span className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Transacted Amount</span>
                        <div className="text-4xl font-black text-primary mb-3 tracking-tight">{formatCurrency(payment.amount)}</div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-base">
                            <CreditCard size={12} className="text-muted" />
                            <span className="text-xs font-bold text-secondary">via {payment.payment_method} {payment.card_last4 && `(•••• ${payment.card_last4})`}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ReceiptItem label="Invoice Identifier" value={payment.invoice_id} />
                        <ReceiptItem label="Subscription Tier" value={`${payment.plan} (${payment.plan_type})`} />
                        <ReceiptItem label="Provisioned Date" value={formatDate(payment.created_at)} />
                        <ReceiptItem label="Settlement Node" value={payment.paid_at ? formatDate(payment.paid_at) : 'Awaiting Settlement'} />
                    </div>

                    {payment.error_message && (
                        <div className="flex items-start gap-4 p-4 bg-rose-50 border border-rose-200 rounded-md text-rose-600">
                            <XCircle size={18} className="mt-0.5 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold mb-0.5">Transaction Error</span>
                                <span className="text-xs opacity-90 leading-relaxed font-medium">{payment.error_message}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-base mt-2">
                        <Button variant="ghost" className="flex-1 h-11 border border-base rounded-md text-xs font-bold">
                            View Full Invoice
                        </Button>
                        <Button variant="primary" className="flex-1 h-11 rounded-md text-xs font-bold flex items-center justify-center gap-2">
                            <Download size={14} />
                            Download Receipt
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
