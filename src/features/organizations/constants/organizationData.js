import { Building2 } from 'lucide-react';

export const MOCK_ORGANIZATIONS = [
    { id: '1', org_code: "ACM001", name: "Acme Global Solutions", subscription_tier: "Enterprise", status: "active", users_count: 124, projects_count: 45, logo: null, created_at: "2024-01-15T10:00:00Z", email: "contact@acme.com" },
    { id: '2', org_code: "STRK02", name: "Stark Industries", subscription_tier: "Professional", status: "active", users_count: 86, projects_count: 12, logo: null, created_at: "2024-02-01T12:00:00Z", email: "tony@stark.com" },
    { id: '3', org_code: "WYN003", name: "Wayne Enterprises", subscription_tier: "Basic", status: "active", users_count: 24, projects_count: 8, logo: null, created_at: "2024-02-10T09:00:00Z", email: "bruce@wayne.org" },
    { id: '4', org_code: "CYB004", name: "Cyberdyne Systems", subscription_tier: "Professional", status: "warning", users_count: 210, projects_count: 64, logo: null, created_at: "2024-02-15T14:00:00Z", email: "skynet@cyberdyne.com" },
    { id: '5', org_code: "OSC005", name: "OsCorp", subscription_tier: "Enterprise", status: "active", users_count: 156, projects_count: 38, logo: null, created_at: "2024-02-20T11:00:00Z", email: "norman@oscorp.com" },
    { id: '6', org_code: "UMB006", name: "Umbrella Corp", subscription_tier: "Basic", status: "disabled", users_count: 12, projects_count: 2, logo: null, created_at: "2024-02-22T16:00:00Z", email: "wesker@umbrella.com" },
];

export const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'pending', label: 'Pending' },
];

export const TIER_OPTIONS = [
    { value: 'basic', label: 'Basic' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
];

export const FILTER_TIER_OPTIONS = [
    { value: '', label: 'All Plans' },
    ...TIER_OPTIONS
];

export const PLAN_OPTIONS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly (Save 20%)' },
];

export const ORG_TABLE_CONFIG = {
    emptyIcon: Building2,
    emptyTitle: "No organizations found",
    emptyDescription: "Start by creating your first business unit",
    storageKey: "organizations-table",
};
