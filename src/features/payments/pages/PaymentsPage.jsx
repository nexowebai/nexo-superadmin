import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    CreditCard, DollarSign, TrendingUp, Receipt, Download, Eye,
    Building2, Calendar, RefreshCw, Clock, XCircle, CheckCircle2,
    Filter, FileText, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import { DataTable, StatusBadge, TableActions, Select, SearchBar, StatsCard, StatsGrid } from '@components/common';
import { Modal, ModalHeader, ModalTitle, ModalBody, Button } from '@components/ui';
import { formatCurrency, formatDate } from '@utils/format';
import notify from '@utils/notify';
import './PaymentsPage.css';

const MOCK_PAYMENTS = [
    {
        id: 'PAY-001',
        organization_name: 'Acme Foundation',
        org_code: 'ACM001',
        amount: 2499,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Credit Card',
        card_last4: '4242',
        plan: 'Enterprise',
        plan_type: 'yearly',
        invoice_id: 'INV-2026-001',
        created_at: '2026-01-02T10:30:00Z',
        paid_at: '2026-01-02T10:31:00Z',
    },
    {
        id: 'PAY-002',
        organization_name: 'Global Health Initiative',
        org_code: 'GHI002',
        amount: 999,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Bank Transfer',
        plan: 'Professional',
        plan_type: 'yearly',
        invoice_id: 'INV-2026-002',
        created_at: '2026-01-01T14:20:00Z',
        paid_at: '2026-01-01T16:45:00Z',
    },
    {
        id: 'PAY-003',
        organization_name: 'EduTech Solutions',
        org_code: 'ETS003',
        amount: 99,
        currency: 'USD',
        status: 'pending',
        payment_method: 'Credit Card',
        plan: 'Basic',
        plan_type: 'monthly',
        invoice_id: 'INV-2026-003',
        created_at: '2026-01-03T09:00:00Z',
    },
    {
        id: 'PAY-004',
        organization_name: 'Research Labs Inc',
        org_code: 'RLI004',
        amount: 249,
        currency: 'USD',
        status: 'failed',
        payment_method: 'Credit Card',
        card_last4: '1234',
        plan: 'Professional',
        plan_type: 'monthly',
        invoice_id: 'INV-2026-004',
        created_at: '2025-12-28T11:15:00Z',
        error_message: 'Card declined - insufficient funds',
    },
];

const MOCK_STATS = [
    { title: 'Total Revenue', value: '$125,680', icon: DollarSign, trend: 12.5, color: 'var(--primary)' },
    { title: 'Active Subs', value: '1,420', icon: TrendingUp, trend: 8.4, color: 'var(--info)' },
    { title: 'Pending', value: '$3,850', icon: Clock, trend: -2.1, color: 'var(--warning)' },
    { title: 'Failed', value: '12', icon: XCircle, trend: 5.4, color: 'var(--error)' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
];

const PLAN_OPTIONS = [
    { value: '', label: 'All Plans' },
    { value: 'basic', label: 'Basic' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
];

function PaymentDetailModal({ payment, isOpen, onClose }) {
    if (!payment) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalHeader>
                <ModalTitle>Transaction Receipt</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-base">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20 shadow-inner flex-shrink-0">
                                <Building2 size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-primary m-0 mb-1">{payment.organization_name}</h3>
                                <p className="text-xs font-mono font-bold text-muted m-0 uppercase tracking-widest">{payment.org_code} • {payment.id}</p>
                            </div>
                        </div>
                        <StatusBadge status={payment.status} size="xl" />
                    </div>

                    <div className="text-center py-10 bg-surface-lowest border border-base rounded-2xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-info" />
                        <span className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">Amount Transacted</span>
                        <div className="text-5xl font-black text-primary mb-3 tracking-tight">{formatCurrency(payment.amount)}</div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-elevated rounded-full border border-base">
                            <CreditCard size={14} className="text-muted" />
                            <span className="text-sm font-bold text-secondary">via {payment.payment_method} {payment.card_last4 && `(•••• ${payment.card_last4})`}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReceiptItem label="Invoice Number" value={payment.invoice_id} />
                        <ReceiptItem label="Subscription Plan" value={`${payment.plan} (${payment.plan_type})`} />
                        <ReceiptItem label="Created Date" value={formatDate(payment.created_at)} />
                        <ReceiptItem label="Settlement Date" value={payment.paid_at ? formatDate(payment.paid_at) : 'Awaiting Settlement'} />
                    </div>

                    {payment.error_message && (
                        <div className="flex items-start gap-4 p-5 bg-error-soft/30 border border-error/50 rounded-xl text-error">
                            <XCircle size={20} className="mt-0.5 shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-bold mb-1">Transaction Failed</span>
                                <span className="text-sm opacity-90 leading-relaxed">{payment.error_message}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-base mt-2">
                        <Button variant="outline" leftIcon={FileText} onClick={() => notify.info('Viewing full invoice')} className="flex-1 h-[48px]">
                            View Full Invoice
                        </Button>
                        <Button variant="primary" leftIcon={Download} onClick={() => notify.info('Downloading receipt')} className="flex-1 h-[48px]">
                            Download PDF Receipt
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}

const ReceiptItem = ({ label, value }) => (
    <div className="flex flex-col p-4 bg-surface-lowest border border-base rounded-xl transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm">
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">{label}</span>
        <span className="text-[15px] font-bold text-primary">{value}</span>
    </div>
);

function PaymentsPage() {
    const { setHeaderProps } = useLayout();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [plan, setPlan] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        setHeaderProps({
            title: "Payments & Invoices",
            action: null
        });
    }, [setHeaderProps]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            notify.success('Transactions synchronized');
        }, 800);
    };

    const filteredPayments = useMemo(() => {
        return MOCK_PAYMENTS.filter(payment => {
            if (status && payment.status !== status) return false;
            if (plan && payment.plan.toLowerCase() !== plan) return false;
            if (search) {
                const searchLower = search.toLowerCase();
                return (
                    payment.organization_name.toLowerCase().includes(searchLower) ||
                    payment.org_code.toLowerCase().includes(searchLower) ||
                    payment.invoice_id.toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }, [search, status, plan]);

    const columns = useMemo(() => [
        {
            key: 'invoice_id',
            label: 'Invoice #',
            width: 140,
            render: (val) => <span className="font-mono text-xs font-bold text-muted">{val}</span>
        },
        {
            key: 'organization_name',
            label: 'Organization',
            width: 280,
            sortable: true,
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="payment-org-icon-refined">
                        <Building2 size={16} />
                    </div>
                    <span className="font-bold text-primary">{val}</span>
                </div>
            )
        },
        {
            key: 'plan',
            label: 'Plan',
            width: 140,
            render: (val) => (
                <span className={`tier-badge-pro tier-badge-pro--${val.toLowerCase()}`}>
                    {val}
                </span>
            )
        },
        {
            key: 'plan_type',
            label: 'Billing Cycle',
            width: 130,
            render: (val) => (
                <span className="text-xs font-bold uppercase text-secondary bg-elevated px-2 py-1 rounded">
                    {val}
                </span>
            )
        },
        {
            key: 'payment_method',
            label: 'Method',
            width: 140,
            render: (val, row) => (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary uppercase">{val}</span>
                    {row.card_last4 && <span className="text-[10px] text-muted tracking-wide">•••• {row.card_last4}</span>}
                </div>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            width: 140,
            sortable: true,
            render: (val) => <span className="font-black text-primary">{formatCurrency(val)}</span>
        },
        {
            key: 'created_at',
            label: 'Date',
            width: 150,
            sortable: true,
            render: (val) => (
                <div className="date-pill">
                    <Clock size={12} />
                    <span>{formatDate(val)}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: 140,
            render: (val) => <StatusBadge status={val} />
        },
        {
            key: 'actions',
            label: 'Actions',
            width: 120,
            align: 'right',
            render: (_, row) => (
                <TableActions
                    actions={[
                        {
                            label: 'Details',
                            icon: Eye,
                            variant: 'info',
                            onClick: () => setSelectedPayment(row)
                        },
                        {
                            label: 'Download',
                            icon: Download,
                            variant: 'success',
                            onClick: () => notify.info('Downloading PDF...')
                        }
                    ]}
                />
            )
        }
    ], []);

    return (
        <PageContainer>
            <StatsGrid className="mb-8" columns={4}>
                {MOCK_STATS.map((stat, i) => (
                    <StatsCard key={i} {...stat} loading={loading} />
                ))}
            </StatsGrid>

            <DataTable
                columns={columns}
                data={filteredPayments}
                loading={loading}
                emptyIcon={Receipt}
                emptyTitle="No payments found"
                emptyDescription="Try broadening your search or filter criteria"
                showToolbar
                search={search}
                onSearchChange={setSearch}
                onRefresh={handleRefresh}
                onExportCSV={() => notify.info('Exporting data...')}
                filters={
                    <>
                        <Select
                            options={STATUS_OPTIONS}
                            value={status}
                            onChange={setStatus}
                            placeholder="Status"
                        />
                        <Select
                            options={PLAN_OPTIONS}
                            value={plan}
                            onChange={setPlan}
                            placeholder="Plan"
                        />
                    </>
                }
            />

            <PaymentDetailModal
                payment={selectedPayment}
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
            />
        </PageContainer>
    );
}

export default PaymentsPage;
