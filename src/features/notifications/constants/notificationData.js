export const MOCK_NOTIFICATIONS = [
    {
        id: 'NOT-001',
        title: 'New Organization Request',
        message: 'Stark Industries has requested to join the Nexo platform. Review the application in the requests tab.',
        type: 'user',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
        id: 'NOT-002',
        title: 'Payment Received',
        message: 'A payment of $2,499 from Acme Foundation has been processed successfully for the Enterprise Plan.',
        type: 'success',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
        id: 'NOT-003',
        title: 'High Latency Warning',
        message: 'Database latency in us-east-1 is higher than normal (450ms). System performance may be affected.',
        type: 'warning',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: 'NOT-004',
        title: 'System Security Alert',
        message: 'Multiple unauthorized access attempts detected from IP 142.250.190.46 in the last 15 minutes.',
        type: 'error',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
];

export const TAB_OPTIONS = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread Only' },
];
