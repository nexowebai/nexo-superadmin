import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, DollarSign, TrendingUp, Receipt, Search, Filter,
    Download, Eye, CheckCircle2, Clock, XCircle, Building2,
    Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { StatusBadge, EmptyState, Select } from '@components/common';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@components/ui/Modal';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { formatCurrency, formatDate } from '@utils/format';
import notify from '@utils/notify';
import './PaymentsPage.css';

// Mock Data
const MOCK_PAYMENTS = [
    {
        id: 'PAY-001',
        organization_id: 'org_001',
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
        organization_id: 'org_002',
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
        organization_id: 'org_003',
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
        organization_id: 'org_004',
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

const MOCK_STATS = {
    total_revenue: 125680,
    monthly_revenue: 15420,
    pending_payments: 3850,
    failed_payments: 1240,
    growth_percent: 12.5,
};

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
];

const PLAN_OPTIONS = [
    { value: '', label: 'All Plans' },
    { value: 'basic', label: 'Basic' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
];

// Stat Card Component
function StatCard({ icon: Icon, label, value, subLabel, color = 'blue', trend, loading }) {
    if (loading) {
        return (
            <div className="payment-stat-card">
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div className="payment-stat-card__content">
                    <Skeleton width="80px" height="28px" />
                    <Skeleton width="60px" height="14px" style={{ marginTop: 4 }} />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={`payment-stat-card payment-stat-card--${color}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <div className="payment-stat-card__icon">
                <Icon size={24} />
            </div>
            <div className="payment-stat-card__content">
                <div className="payment-stat-card__value">{value}</div>
                <div className="payment-stat-card__label">{label}</div>
                {trend !== undefined && (
                    <div className={`payment-stat-card__trend ${trend >= 0 ? 'up' : 'down'}`}>
                        {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
                {subLabel && <div className="payment-stat-card__sub">{subLabel}</div>}
            </div>
        </motion.div>
    );
}

// Payment Row Component
function PaymentRow({ payment, onClick }) {
    const statusConfig = {
        completed: { icon: CheckCircle2, color: 'green' },
        pending: { icon: Clock, color: 'yellow' },
        failed: { icon: XCircle, color: 'red' },
        refunded: { icon: RefreshCw, color: 'gray' },
    };

    const config = statusConfig[payment.status] || statusConfig.pending;

    return (
        <motion.div
            className="payment-row"
            onClick={() => onClick(payment)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ backgroundColor: 'var(--ds-bg-elevated)' }}
            transition={{ duration: 0.15 }}
        >
            <div className="payment-row__org">
                <div className="payment-row__avatar">
                    <Building2 size={18} />
                </div>
                <div className="payment-row__org-info">
                    <span className="payment-row__org-name">{payment.organization_name}</span>
                    <span className="payment-row__org-code">#{payment.org_code}</span>
                </div>
            </div>

            <div className="payment-row__plan">
                <span className={`plan-tag plan-tag--${payment.plan.toLowerCase()}`}>
                    {payment.plan}
                </span>
                <span className="payment-row__plan-type">{payment.plan_type}</span>
            </div>

            <div className="payment-row__amount">
                <span className="payment-row__amount-value">{formatCurrency(payment.amount)}</span>
                <span className="payment-row__method">{payment.payment_method}</span>
            </div>

            <div className="payment-row__date">
                <span>{formatDate(payment.created_at)}</span>
            </div>

            <div className="payment-row__status">
                <StatusBadge status={payment.status} />
            </div>

            <div className="payment-row__actions">
                <button className="payment-row__action" title="View Details">
                    <Eye size={16} />
                </button>
                <button className="payment-row__action" title="Download Invoice">
                    <Download size={16} />
                </button>
            </div>
        </motion.div>
    );
}

// Payment Detail Modal
function PaymentDetailModal({ payment, isOpen, onClose }) {
    if (!payment) return null;

    const handleDownloadInvoice = () => {
        notify.info('Invoice download will be available soon');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalHeader>
                <ModalTitle>Payment Details</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="payment-detail">
                    {/* Header */}
                    <div className="payment-detail__header">
                        <div className="payment-detail__org">
                            <div className="payment-detail__avatar">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3>{payment.organization_name}</h3>
                                <span>#{payment.org_code}</span>
                            </div>
                        </div>
                        <StatusBadge status={payment.status} size="lg" />
                    </div>

                    {/* Amount */}
                    <div className="payment-detail__amount">
                        <span className="payment-detail__amount-label">Amount Paid</span>
                        <span className="payment-detail__amount-value">{formatCurrency(payment.amount)}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="payment-detail__grid">
                        <div className="payment-detail__item">
                            <span className="payment-detail__item-label">Invoice ID</span>
                            <span className="payment-detail__item-value">{payment.invoice_id}</span>
                        </div>
                        <div className="payment-detail__item">
                            <span className="payment-detail__item-label">Payment ID</span>
                            <span className="payment-detail__item-value">{payment.id}</span>
                        </div>
                        <div className="payment-detail__item">
                            <span className="payment-detail__item-label">Plan</span>
                            <span className="payment-detail__item-value">{payment.plan} ({payment.plan_type})</span>
                        </div>
                        <div className="payment-detail__item">
                            <span className="payment-detail__item-label">Payment Method</span>
                            <span className="payment-detail__item-value">
                                {payment.payment_method}
                                {payment.card_last4 && ` •••• ${payment.card_last4}`}
                            </span>
                        </div>
                        <div className="payment-detail__item">
                            <span className="payment-detail__item-label">Created At</span>
                            <span className="payment-detail__item-value">{formatDate(payment.created_at)}</span>
                        </div>
                        {payment.paid_at && (
                            <div className="payment-detail__item">
                                <span className="payment-detail__item-label">Paid At</span>
                                <span className="payment-detail__item-value">{formatDate(payment.paid_at)}</span>
                            </div>
                        )}
                    </div>

                    {payment.error_message && (
                        <div className="payment-detail__error">
                            <XCircle size={18} />
                            <span>{payment.error_message}</span>
                        </div>
                    )}

                    <div className="payment-detail__actions">
                        <Button variant="secondary" icon={Download} onClick={handleDownloadInvoice}>
                            Download Invoice
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}

function PaymentsPage() {
    const { setHeaderProps } = useLayout();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [plan, setPlan] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        setHeaderProps({
            title: "Payments",
            action: (
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={Download} onClick={handleExport}>
                        Export
                    </Button>
                    <Button variant="secondary" icon={RefreshCw} onClick={handleRefresh} loading={loading}>
                        Refresh
                    </Button>
                </div>
            )
        });
    }, [setHeaderProps, loading]);

    // Filter payments
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

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            notify.success('Payments refreshed');
        }, 1000);
    };

    const handleExport = () => {
        notify.info('Export functionality coming soon');
    };

    return (
        <PageContainer>
            {/* Stats Row */}
            <div className="payments-stats">
                <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={formatCurrency(MOCK_STATS.total_revenue)}
                    color="green"
                    trend={MOCK_STATS.growth_percent}
                    loading={loading}
                />
                <StatCard
                    icon={TrendingUp}
                    label="This Month"
                    value={formatCurrency(MOCK_STATS.monthly_revenue)}
                    color="blue"
                    loading={loading}
                />
                <StatCard
                    icon={Clock}
                    label="Pending"
                    value={formatCurrency(MOCK_STATS.pending_payments)}
                    color="yellow"
                    loading={loading}
                />
                <StatCard
                    icon={XCircle}
                    label="Failed"
                    value={formatCurrency(MOCK_STATS.failed_payments)}
                    color="red"
                    loading={loading}
                />
            </div>

            {/* Filters */}
            <div className="payments-toolbar">
                <div className="payments-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by organization, invoice..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="payments-filters">
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
                </div>
            </div>

            {/* Payments Table */}
            <Card className="payments-table-card">
                <div className="payments-table-header">
                    <div className="payments-table-col">Organization</div>
                    <div className="payments-table-col">Plan</div>
                    <div className="payments-table-col">Amount</div>
                    <div className="payments-table-col">Date</div>
                    <div className="payments-table-col">Status</div>
                    <div className="payments-table-col">Actions</div>
                </div>

                <div className="payments-table-body">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="payment-row payment-row--skeleton">
                                <div className="payment-row__org">
                                    <Skeleton width="40px" height="40px" borderRadius="10px" />
                                    <div>
                                        <Skeleton width="140px" height="14px" />
                                        <Skeleton width="80px" height="12px" style={{ marginTop: 4 }} />
                                    </div>
                                </div>
                                <Skeleton width="80px" height="24px" borderRadius="6px" />
                                <Skeleton width="80px" height="20px" />
                                <Skeleton width="90px" height="16px" />
                                <Skeleton width="80px" height="24px" borderRadius="100px" />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Skeleton width="32px" height="32px" borderRadius="8px" />
                                    <Skeleton width="32px" height="32px" borderRadius="8px" />
                                </div>
                            </div>
                        ))
                    ) : filteredPayments.length === 0 ? (
                        <EmptyState
                            icon={Receipt}
                            title="No payments found"
                            description={search || status || plan ? 'Try adjusting your filters' : 'No payment records yet'}
                        />
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredPayments.map(payment => (
                                <PaymentRow
                                    key={payment.id}
                                    payment={payment}
                                    onClick={setSelectedPayment}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </Card>

            <PaymentDetailModal
                payment={selectedPayment}
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
            />
        </PageContainer>
    );
}

export default PaymentsPage;
