import { useState, useEffect } from 'react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Tabs, Button, Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@components/ui';
import { DataTable, StatusBadge, Select } from '@components/common';
import { useLayout } from '@context';
import { Plus, Tag, CreditCard, Check, Copy, Rocket, Sparkles } from 'lucide-react';
import notify from '@utils/notify';
import './BillingSystem.css';

const TAB_OPTIONS = [
    { value: 'plans', label: 'Subscription Plans', icon: CreditCard },
    { value: 'coupons', label: 'Discount Coupons', icon: Tag },
];

const MOCK_PLANS = [
    { id: 'p_1', name: 'Basic', price: 99, billing_cycle: 'monthly', features: 'Up to 5 Users, Standard Support', status: 'active', base_projects: 10, extra_project_cost: 0 },
    { id: 'p_2', name: 'Professional', price: 299, billing_cycle: 'monthly', features: 'Up to 25 Users, Priority Support, Analytics', status: 'active', base_projects: 20, extra_project_cost: 0 },
    { id: 'p_3', name: 'Enterprise', price: 'Pro Base + Overages', billing_cycle: 'monthly', features: 'Unlimited Users, Custom Base Projects, Personalized Extra Cost', status: 'active', base_projects: 20, extra_project_cost: 50 },
];

const MOCK_COUPONS = [
    { id: 'c_1', code: 'WELCOME50', type: 'percentage', value: 50, duration: 'once', status: 'active', redemptions: 12 },
    { id: 'c_2', code: 'PROYEARLY20', type: 'percentage', value: 20, duration: 'repeating', status: 'active', redemptions: 4 },
    { id: 'c_3', code: 'ENTERPRISE_100', type: 'fixed', value: 100, duration: 'forever', status: 'disabled', redemptions: 0 },
];

export default function BillingSystemPage() {
    const { setHeaderProps } = useLayout();
    const [activeTab, setActiveTab] = useState('plans');
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    // Form States
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [discountType, setDiscountType] = useState('percentage');
    const [couponDuration, setCouponDuration] = useState('once');

    useEffect(() => {
        setHeaderProps({
            title: 'Monetization & Billing',
            action: (
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => activeTab === 'plans' ? setIsPlanModalOpen(true) : setIsCouponModalOpen(true)}
                    className="h-[48px] px-6"
                >
                    {activeTab === 'plans' ? 'Create Plan' : 'Generate Coupon'}
                </Button>
            )
        });
    }, [setHeaderProps, activeTab]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        notify.success('Copied to clipboard');
    };

    const planColumns = [
        { key: 'name', label: 'Plan Name', render: (val) => <span className="font-bold text-primary">{val}</span> },
        { key: 'price', label: 'Pricing', render: (val, row) => <span className="font-semibold">{typeof val === 'number' ? `$${val} / ${row.billing_cycle}` : val}</span> },
        {
            key: 'limits', label: 'Project Limits', render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">Base: {row.base_projects} Projects</span>
                    {row.extra_project_cost > 0 && <span className="text-xs text-secondary">Extra: ${row.extra_project_cost}/project</span>}
                </div>
            )
        },
        { key: 'features', label: 'Key Features', render: (val) => <span className="text-secondary text-sm truncate max-w-[200px] block">{val}</span> },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
    ];

    const couponColumns = [
        {
            key: 'code', label: 'Coupon Code', render: (val) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{val}</span>
                    <button onClick={() => copyToClipboard(val)} className="text-muted hover:text-primary transition-colors"><Copy size={14} /></button>
                </div>
            )
        },
        { key: 'value', label: 'Discount', render: (val, row) => <span className="font-semibold">{row.type === 'percentage' ? `${val}% OFF` : `$${val} OFF`}</span> },
        { key: 'duration', label: 'Duration', render: (val) => <span className="capitalize">{val}</span> },
        { key: 'redemptions', label: 'Redeemed', render: (val) => <span className="font-medium text-secondary">{val} times</span> },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
    ];

    return (
        <PageContainer>
            <div className="billing-system">
                <Tabs
                    options={TAB_OPTIONS}
                    value={activeTab}
                    onChange={setActiveTab}
                    className="mb-8 p-1 bg-elevated rounded-2xl w-fit"
                />

                <div className="billing-content card-pro p-0 overflow-hidden">
                    {activeTab === 'plans' ? (
                        <DataTable
                            data={MOCK_PLANS}
                            columns={planColumns}
                            emptyTitle="No Plans Created"
                        />
                    ) : (
                        <DataTable
                            data={MOCK_COUPONS}
                            columns={couponColumns}
                            emptyTitle="No Coupons Active"
                        />
                    )}
                </div>
            </div>

            {/* Plan Modal */}
            <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} size="md" showCloseButton>
                <div className="p-6">
                    <ModalHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary shadow-sm">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <ModalTitle>Create Subscription Plan</ModalTitle>
                                <ModalDescription>Define a new pricing tier with specific limits and costs</ModalDescription>
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody className="space-y-4">
                        <div className="form-field-v2">
                            <label className="flex items-center gap-2">
                                <Rocket size={14} className="text-primary" />
                                Plan Name
                            </label>
                            <input type="text" placeholder="e.g. Enterprise Plus" className="bg-bg-elevated" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-field-v2">
                                <label>Price ($)</label>
                                <input type="number" placeholder="99.00" />
                            </div>
                            <div className="form-field-v2">
                                <label>Billing Cycle</label>
                                <Select
                                    options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]}
                                    value={billingCycle}
                                    onChange={setBillingCycle}
                                    fullWidth
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-field-v2">
                                <label>Base Projects Allowed</label>
                                <input type="number" placeholder="e.g. 10 or 20" />
                            </div>
                            <div className="form-field-v2">
                                <label>Extra Project Cost ($)</label>
                                <input type="number" placeholder="Cost per extra project" />
                            </div>
                        </div>
                        <div className="form-field-v2">
                            <label>Available Features Summary</label>
                            <textarea className="p-4 rounded-xl border-1.5 border-base bg-surface focus:border-primary outline-none" rows="3" placeholder="Comma separated list..."></textarea>
                        </div>
                    </ModalBody>
                    <ModalFooter className="mt-8 flex gap-4">
                        <Button variant="secondary" fullWidth onClick={() => setIsPlanModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" fullWidth onClick={() => { notify.success('Plan Created Successfully'); setIsPlanModalOpen(false); }}>Save Plan</Button>
                    </ModalFooter>
                </div>
            </Modal>

            {/* Coupon Modal */}
            <Modal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} size="md" showCloseButton>
                <div className="p-6">
                    <ModalHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-info-soft flex items-center justify-center text-info shadow-sm">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <ModalTitle>Generate Discount Coupon</ModalTitle>
                                <ModalDescription>Create promotional codes for service discounts</ModalDescription>
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody className="space-y-4">
                        <div className="form-field-v2">
                            <label className="flex items-center gap-2">
                                <Tag size={14} className="text-info" />
                                Coupon Code
                            </label>
                            <input type="text" placeholder="e.g. SUMMERSALE50" className="bg-bg-elevated" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-field-v2">
                                <label>Discount Type</label>
                                <Select
                                    options={[{ label: 'Percentage (%)', value: 'percentage' }, { label: 'Fixed Amount ($)', value: 'fixed' }]}
                                    value={discountType}
                                    onChange={setDiscountType}
                                    fullWidth
                                />
                            </div>
                            <div className="form-field-v2">
                                <label>Value</label>
                                <input type="number" placeholder={discountType === 'percentage' ? "e.g. 20" : "e.g. 100"} />
                            </div>
                        </div>
                        <div className="form-field-v2">
                            <label>Duration</label>
                            <Select
                                options={[
                                    { label: 'Once (Applies to first invoice only)', value: 'once' },
                                    { label: 'Repeating (Applies to all invoices)', value: 'repeating' },
                                    { label: 'Forever', value: 'forever' }
                                ]}
                                value={couponDuration}
                                onChange={setCouponDuration}
                                fullWidth
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter className="mt-8 flex gap-4">
                        <Button variant="secondary" fullWidth onClick={() => setIsCouponModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" fullWidth onClick={() => { notify.success('Coupon Generated'); setIsCouponModalOpen(false); }}>Create Coupon</Button>
                    </ModalFooter>
                </div>
            </Modal>

        </PageContainer>
    );
}
