import { useState, useCallback } from 'react';
import notify from '@utils/notify';

export function useBillingPage() {
    const [activeTab, setActiveTab] = useState('plans');
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    // Form States
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [discountType, setDiscountType] = useState('percentage');
    const [couponDuration, setCouponDuration] = useState('once');

    const copyToClipboard = useCallback((text) => {
        navigator.clipboard.writeText(text);
        notify.success('Copied to clipboard');
    }, []);

    const handleCreateClick = useCallback(() => {
        if (activeTab === 'plans') setIsPlanModalOpen(true);
        else setIsCouponModalOpen(true);
    }, [activeTab]);

    return {
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
    };
}
