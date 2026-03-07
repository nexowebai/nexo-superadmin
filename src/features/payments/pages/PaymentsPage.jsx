import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    CreditCard, DollarSign, TrendingUp, Receipt, Download, Eye,
    Building2, Calendar, RefreshCw, Clock, XCircle, CheckCircle2,
    Filter, FileText, ArrowUpRight, ArrowDownRight, BarChart2, Activity
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
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

const REVENUE_DATA = [
    { name: 'Jan', revenue: 12500, expenses: 3400 },
    { name: 'Feb', revenue: 15000, expenses: 4398 },
    { name: 'Mar', revenue: 18000, expenses: 5800 },
    { name: 'Apr', revenue: 21780, expenses: 4908 },
    { name: 'May', revenue: 25890, expenses: 6800 },
    { name: 'Jun', revenue: 32390, expenses: 7800 },
];

const PLAN_DISTRIBUTION = [
    { name: 'Basic', baseLimit: 10, avgUsage: 8, extraCost: 0 },
    { name: 'Pro', baseLimit: 20, avgUsage: 16, extraCost: 0 },
    { name: 'Enterprise', baseLimit: 50, avgUsage: 45, extraCost: 50 },
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
                        <Button variant="primary" icon={Download} className="flex-1 h-11 rounded-md text-xs font-bold">
                            Download Receipt
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const ReceiptItem = ({ label, value }) => (
    <div className="receipt-item">
        <span className="receipt-item-label">{label}</span>
        <span className="receipt-item-value">{value}</span>
    </div>
);


function PaymentsPage() {
    const { setHeaderProps } = useLayout();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [plan, setPlan] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [chartView, setChartView] = useState('revenue');
    const [usageView, setUsageView] = useState('usage');

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
            <div className="payments-container-nx">
                <div className="mb-8">
                    <StatsGrid columns={4}>
                        {MOCK_STATS.map((stat, i) => (
                            <StatsCard key={i} {...stat} loading={loading} />
                        ))}
                    </StatsGrid>
                </div>

                {/* Interactive Analytics Section */}
                <div className="analytics-grid-nx">
                    {/* Chart 1: Revenue vs Expenses */}
                    <div className="card-pro p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary m-0">Revenue Velocity</h3>
                                    <p className="text-xs text-muted mt-0.5 m-0 font-medium">Monthly revenue vs ops outflow</p>
                                </div>
                            </div>
                            <Select
                                options={[
                                    { label: 'Revenue & Costs', value: 'revenue' },
                                    { label: 'Net Profit', value: 'profit' }
                                ]}
                                value={chartView}
                                onChange={setChartView}
                                className="w-48"
                            />
                        </div>
                        <div style={{ height: 260, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--error)" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="var(--error)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" strokeOpacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-base)', color: 'var(--text-primary)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                                    {chartView === 'revenue' && (
                                        <Area type="monotone" dataKey="expenses" stroke="var(--error)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExp)" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Plan Project Limits & Extra Analytics */}
                    <div className="card-pro p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                    <BarChart2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary m-0">Subscription Density</h3>
                                    <p className="text-xs text-muted mt-0.5 m-0 font-medium">Extra resource allocation metrics</p>
                                </div>
                            </div>
                            <Select
                                options={[
                                    { label: 'Usage vs Limit', value: 'usage' },
                                    { label: 'Extra Costs', value: 'extra' }
                                ]}
                                value={usageView}
                                onChange={setUsageView}
                                className="w-48"
                            />
                        </div>
                        <div style={{ height: 260, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PLAN_DISTRIBUTION} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" strokeOpacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-base)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }}
                                    />
                                    <Bar dataKey={usageView === 'usage' ? 'baseLimit' : 'extraCost'} name={usageView === 'usage' ? "Allowed Projects" : "Extra Revenue"} fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={28} />
                                    <Bar dataKey={usageView === 'usage' ? 'avgUsage' : 'extraCost'} name={usageView === 'usage' ? "Avg Project Usage" : "Extra Usage"} fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="card-pro overflow-hidden">
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
                                    className="w-40"
                                />
                                <Select
                                    options={PLAN_OPTIONS}
                                    value={plan}
                                    onChange={setPlan}
                                    placeholder="Plan"
                                    className="w-40"
                                />
                            </>
                        }
                    />
                </div>

                <PaymentDetailModal
                    payment={selectedPayment}
                    isOpen={!!selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            </div>
        </PageContainer>
    );
}


export default PaymentsPage;
