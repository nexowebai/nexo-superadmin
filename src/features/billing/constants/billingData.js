import { CreditCard, Tag } from 'lucide-react';

export const TAB_OPTIONS = [
    { value: 'plans', label: 'Subscription Plans', icon: CreditCard },
    { value: 'coupons', label: 'Discount Coupons', icon: Tag },
];

export const MOCK_PLANS = [
    { id: 'p_1', name: 'Basic', price: 99, billing_cycle: 'monthly', features: 'Up to 5 Users, Standard Support', status: 'active', base_projects: 10, extra_project_cost: 0 },
    { id: 'p_2', name: 'Professional', price: 299, billing_cycle: 'monthly', features: 'Up to 25 Users, Priority Support, Analytics', status: 'active', base_projects: 20, extra_project_cost: 0 },
    { id: 'p_3', name: 'Enterprise', price: 'Pro Base + Overages', billing_cycle: 'monthly', features: 'Unlimited Users, Custom Base Projects, Personalized Extra Cost', status: 'active', base_projects: 20, extra_project_cost: 50 },
];

export const MOCK_COUPONS = [
    { id: 'c_1', code: 'WELCOME50', type: 'percentage', value: 50, duration: 'once', status: 'active', redemptions: 12 },
    { id: 'c_2', code: 'PROYEARLY20', type: 'percentage', value: 20, duration: 'repeating', status: 'active', redemptions: 4 },
    { id: 'c_3', code: 'ENTERPRISE_100', type: 'fixed', value: 100, duration: 'forever', status: 'disabled', redemptions: 0 },
];
