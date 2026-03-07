import { Terminal, Shield, XCircle, CheckCircle2 } from 'lucide-react';

export const MOCK_LOGS = [
    {
        id: 'LOG-001',
        log_level: 'info',
        log_type: 'login',
        message: 'Super Admin login successful from unknown IP 192.168.1.1',
        email: 'admin@nexo.com',
        organization_name: 'System',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        ip_address: '192.168.1.1',
        user_role: 'Super Admin'
    },
    {
        id: 'LOG-002',
        log_level: 'success',
        log_type: 'update',
        message: 'Organization "Stark Industries" subscription upgraded to Enterprise',
        email: 'tony@stark.com',
        organization_name: 'Stark Industries',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        ip_address: '10.0.0.45',
        user_role: 'Org Admin'
    },
    {
        id: 'LOG-003',
        log_level: 'error',
        log_type: 'security',
        message: 'Multiple failed login attempts detected for account research@umbrella.com',
        email: 'research@umbrella.com',
        organization_name: 'Umbrella Corp',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        ip_address: '45.12.3.99',
        user_role: 'User'
    },
];

export const MOCK_STATS = [
    { title: 'Total Events', value: '45.2K', icon: Terminal, color: 'var(--primary)' },
    { title: 'Security Alerts', value: '14', icon: Shield, color: 'var(--error)' },
    { title: 'System Errors', value: '3', icon: XCircle, color: 'var(--warning)' },
    { title: 'Health Score', value: '98%', icon: CheckCircle2, color: 'var(--success)' },
];

export const LEVEL_OPTIONS = [
    { value: '', label: 'All Levels' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
];

export const TYPE_OPTIONS = [
    { value: '', label: 'All Types' },
    { value: 'login', label: 'Login' },
    { value: 'security', label: 'Security' },
    { value: 'update', label: 'Update' },
    { value: 'database', label: 'Database' },
];
