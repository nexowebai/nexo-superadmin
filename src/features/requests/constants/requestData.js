import { Layers, Clock, Check, AlertCircle } from 'lucide-react';

export const MOCK_REQUESTS = [
    { id: 'REQ-001', organization_name: 'Stark Industries', contact_email: 'tony@stark.com', status: 'pending', message: 'Looking to migrate our global operations to Nexo. Need high-scale data residency features.', created_at: '2026-03-03T10:30:00Z' },
    { id: 'REQ-002', organization_name: 'Wayne Enterprises', contact_email: 'bruce@wayne.com', status: 'pending', message: 'Security is our top priority. We need a custom SLA for our private cloud deployment.', created_at: '2026-03-02T14:20:00Z' },
    { id: 'REQ-003', organization_name: 'Umbrella Corp', contact_email: 'albert@umbrella.com', status: 'approved', message: 'New research foundation setup.', created_at: '2026-03-01T09:00:00Z' },
    { id: 'REQ-004', organization_name: 'Oscorp', contact_email: 'norman@oscorp.com', status: 'rejected', message: 'Testing the platform capabilities.', created_at: '2026-02-28T11:15:00Z' },
];

export const MOCK_STATS = [
    { title: 'Total Requests', value: '1,248', icon: Layers, trend: 12.5, color: 'var(--primary)' },
    { title: 'Pending Approval', value: '42', icon: Clock, trend: -5.2, color: 'var(--warning)' },
    { title: 'Approved', value: '1,180', icon: Check, trend: 8.4, color: 'var(--success)' },
    { title: 'Rejected', value: '26', icon: AlertCircle, trend: 2.1, color: 'var(--error)' },
];

export const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

export const REQUEST_TABLE_CONFIG = {
    emptyTitle: "No requests found",
    emptyDescription: "System will display pending organization requests here",
    storageKey: "requests-table",
};
