import { useEffect } from 'react';
import { Plus } from 'lucide-react';

import { PageContainer } from '@components/layout/DashboardLayout';
import { Tabs, Button } from '@components/ui';
import { useLayout } from '@context';

// Feature-specific
import { useBillingPage } from '../hooks/useBillingPage';
import { TAB_OPTIONS, MOCK_PLANS, MOCK_COUPONS } from '../constants/billingData';
import { BillingTables } from '../components/BillingTables';
import { PlanModal, CouponModal } from '../components/BillingModals';

import './BillingSystem.css';

export default function BillingSystemPage() {
    const { setHeaderProps } = useLayout();
    const {
        activeTab,
        setActiveTab,
        isPlanModalOpen,
        setIsPlanModalOpen,
        isCouponModalOpen,
        setIsCouponModalOpen,
        billingCycle,
        setBillingCycle,
        discountType,
        setDiscountType,
        couponDuration,
        setCouponDuration,
        copyToClipboard,
        handleCreateClick
    } = useBillingPage();

    useEffect(() => {
        setHeaderProps({
            title: 'Monetization & Billing',
            action: (
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleCreateClick}
                >
                    {activeTab === 'plans' ? 'Create Plan' : 'Generate Coupon'}
                </Button>
            )
        });
    }, [setHeaderProps, activeTab, handleCreateClick]);

    return (
        <PageContainer className="billing-v2 pb-12">
            <div className="flex flex-col gap-8">
                {/* 1. Categorical Navigation */}
                <div className="flex justify-center">
                    <Tabs
                        options={TAB_OPTIONS}
                        value={activeTab}
                        onChange={setActiveTab}
                    />
                </div>

                {/* 2. Audit & Data Tables */}
                <BillingTables
                    activeTab={activeTab}
                    plans={MOCK_PLANS}
                    coupons={MOCK_COUPONS}
                    onCopy={copyToClipboard}
                />
            </div>

            {/* 3. Transactional Modal Layers */}
            <PlanModal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                billingCycle={billingCycle}
                setBillingCycle={setBillingCycle}
            />

            <CouponModal
                isOpen={isCouponModalOpen}
                onClose={() => setIsCouponModalOpen(false)}
                discountType={discountType}
                setDiscountType={setDiscountType}
                couponDuration={couponDuration}
                setCouponDuration={setCouponDuration}
            />
        </PageContainer>
    );
}
