import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    FileCheck, Check, X as XIcon, Building2, Calendar,
    MessageSquare, Mail, RefreshCw, Download, Filter,
    Layers, Users, Clock, AlertCircle, Eye
} from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import { DataTable, StatusBadge, TableActions, Select, SearchBar, StatsCard, StatsGrid } from '@components/common';
import { ConfirmModal, Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@components/ui';
import { useRequests, useApproveRequest, useRejectRequest } from '../../hooks/';
import { formatDate } from '@utils/format';
import notify from '@utils/notify';
import '../css/requests.css';

const MOCK_REQUESTS = [
    {
        id: 'REQ-001',
        organization_name: 'Stark Industries',
        contact_email: 'tony@stark.com',
        status: 'pending',
        message: 'Looking to migrate our global operations to Nexo. Need high-scale data residency features.',
        created_at: '2026-03-03T10:30:00Z',
    },
    {
        id: 'REQ-002',
        organization_name: 'Wayne Enterprises',
        contact_email: 'bruce@wayne.com',
        status: 'pending',
        message: 'Security is our top priority. We need a custom SLA for our private cloud deployment.',
        created_at: '2026-03-02T14:20:00Z',
    },
    {
        id: 'REQ-003',
        organization_name: 'Umbrella Corp',
        contact_email: 'albert@umbrella.com',
        status: 'approved',
        message: 'New research foundation setup.',
        created_at: '2026-03-01T09:00:00Z',
    },
    {
        id: 'REQ-004',
        organization_name: 'Oscorp',
        contact_email: 'norman@oscorp.com',
        status: 'rejected',
        message: 'Testing the platform capabilities.',
        created_at: '2026-02-28T11:15:00Z',
    },
];

const MOCK_STATS = [
    { title: 'Total Requests', value: '1,248', icon: Layers, trend: 12.5, color: 'var(--primary)' },
    { title: 'Pending Approval', value: '42', icon: Clock, trend: -5.2, color: 'var(--warning)' },
    { title: 'Approved', value: '1,180', icon: Check, trend: 8.4, color: 'var(--success)' },
    { title: 'Rejected', value: '26', icon: AlertCircle, trend: 2.1, color: 'var(--error)' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

function RequestsPage() {
    const { setHeaderProps } = useLayout();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [rejectModal, setRejectModal] = useState({ isOpen: false, request: null });
    const [detailModal, setDetailModal] = useState({ isOpen: false, request: null });
    const [rejectReason, setRejectReason] = useState('');

    // In a real app, we'd use hooks. Here we'll use mock data if real data is empty
    const { data: realData, isLoading, refetch } = useRequests({
        page,
        limit,
        status: status || undefined,
        search: search || undefined
    });

    const { mutate: approveRequest, isPending: approving } = useApproveRequest();
    const { mutate: rejectRequest, isPending: rejecting } = useRejectRequest();

    const requests = realData?.requests?.length > 0 ? realData.requests : MOCK_REQUESTS;
    const pagination = realData?.pagination || { page: 1, limit: 20, total: 4, pages: 1 };

    useEffect(() => {
        setHeaderProps({
            title: "Organization Requests",
            action: null
        });
    }, [setHeaderProps]);

    const handleApprove = useCallback((req) => {
        notify.promise(
            new Promise((resolve, reject) => {
                approveRequest(req.id, {
                    onSuccess: () => {
                        refetch();
                        resolve();
                    },
                    onError: reject
                });
            }),
            {
                loading: `Approving ${req.organization_name}...`,
                success: `${req.organization_name} approved successfully!`,
                error: (err) => err?.message || 'Failed to approve request'
            }
        );
    }, [approveRequest, refetch]);

    const handleRejectConfirm = useCallback(() => {
        if (!rejectModal.request) return;
        if (!rejectReason.trim()) {
            notify.error('Please provide a reason for rejection');
            return;
        }

        notify.promise(
            new Promise((resolve, reject) => {
                rejectRequest(
                    { id: rejectModal.request.id, reason: rejectReason },
                    {
                        onSuccess: () => {
                            setRejectModal({ isOpen: false, request: null });
                            setRejectReason('');
                            refetch();
                            resolve();
                        },
                        onError: reject
                    }
                );
            }),
            {
                loading: 'Rejecting request...',
                success: 'Request rejected',
                error: (err) => err?.message || 'Failed to reject request'
            }
        );
    }, [rejectModal.request, rejectReason, rejectRequest, refetch]);

    const columns = useMemo(() => [
        {
            key: 'organization_name',
            label: 'Organization Name',
            width: 250,
            sortable: true,
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="org-icon-sq">
                        <Building2 size={16} />
                    </div>
                    <span className="font-bold text-primary">{val}</span>
                </div>
            )
        },
        {
            key: 'contact_email',
            label: 'Contact Email',
            width: 200,
            render: (val) => (
                <div className="flex items-center gap-2 text-secondary">
                    <Mail size={14} className="text-muted" />
                    <span>{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: 150,
            render: (val) => <StatusBadge status={val} />
        },
        {
            key: 'created_at',
            label: 'Requested At',
            width: 180,
            render: (val) => (
                <div className="date-pill">
                    <Calendar size={12} />
                    <span>{formatDate(val)}</span>
                </div>
            )
        },
        {
            key: 'message',
            label: 'Request Message',
            width: 300,
            render: (val) => val ? (
                <div className="flex items-start gap-2 max-w-[280px]">
                    <MessageSquare size={14} className="text-muted mt-1 shrink-0" />
                    <span className="text-sm text-secondary truncate-2-lines">{val}</span>
                </div>
            ) : <span className="text-muted">—</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            width: 140,
            align: 'right',
            render: (_, row) => {
                const actions = [];
                actions.push({
                    label: 'View Details',
                    icon: Eye,
                    variant: 'primary',
                    onClick: () => setDetailModal({ isOpen: true, request: row })
                });

                if (row.status === 'pending') {
                    actions.push({
                        label: 'Approve',
                        icon: Check,
                        variant: 'success',
                        onClick: () => handleApprove(row)
                    });
                    actions.push({
                        label: 'Reject',
                        icon: XIcon,
                        variant: 'danger',
                        onClick: () => setRejectModal({ isOpen: true, request: row })
                    });
                }

                return <TableActions actions={actions} />;
            }
        }
    ], [handleApprove]);

    return (
        <PageContainer>
            <StatsGrid className="mb-8">
                {MOCK_STATS.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </StatsGrid>

            <DataTable
                columns={columns}
                data={requests}
                loading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={(p, l) => { setPage(p); setLimit(l); }}
                emptyIcon={FileCheck}
                emptyTitle="No requests found"
                emptyDescription={status ? 'Try changing the filter' : 'No pending organization requests'}
                showToolbar
                search={search}
                onSearchChange={setSearch}
                onRefresh={refetch}
                onExportCSV={() => notify.info('Export started')}
                filters={
                    <Select
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={(v) => { setStatus(v); setPage(1); }}
                        placeholder="Filter Status"
                    />
                }
            />

            <ConfirmModal
                isOpen={rejectModal.isOpen}
                onClose={() => { setRejectModal({ isOpen: false, request: null }); setRejectReason(''); }}
                onConfirm={handleRejectConfirm}
                title="Reject Request"
                description={
                    <div className="modal-form-content">
                        <div className="modal-info-box-v2">
                            <Building2 size={24} className="text-primary" />
                            <div>
                                <p className="font-bold text-primary">{rejectModal.request?.organization_name}</p>
                                <p className="text-xs text-muted">{rejectModal.request?.contact_email}</p>
                            </div>
                        </div>
                        <div className="modal-input-group">
                            <label>Reason for rejection</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Please explain why this request is being rejected..."
                                rows={4}
                            />
                        </div>
                    </div>
                }
                confirmText="Confirm Rejection"
                variant="delete"
                loading={rejecting}
            />

            <Modal isOpen={detailModal.isOpen} onClose={() => setDetailModal({ isOpen: false, request: null })} size="md">
                <ModalHeader>
                    <ModalTitle>Request Details</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {detailModal.request && (
                        <div className="req-detail-container">
                            <div className="req-detail-header">
                                <div className="req-detail-icon">
                                    <Building2 size={24} />
                                </div>
                                <div className="req-detail-title-group">
                                    <h3>{detailModal.request.organization_name}</h3>
                                    <div className="req-detail-subtitle">
                                        <Mail size={14} />
                                        <span>{detailModal.request.contact_email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="req-detail-grid">
                                <div className="req-detail-box">
                                    <span className="req-detail-box-label">Status</span>
                                    <StatusBadge status={detailModal.request.status} />
                                </div>
                                <div className="req-detail-box">
                                    <span className="req-detail-box-label">Submitted On</span>
                                    <div className="req-detail-box-value">
                                        <Calendar size={14} />
                                        <span>{formatDate(detailModal.request.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="req-detail-message">
                                <span className="req-detail-message-label">
                                    <MessageSquare size={14} /> Message
                                </span>
                                <p className="req-detail-message-text">
                                    {detailModal.request.message || 'No additional message provided.'}
                                </p>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <div className="w-full flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDetailModal({ isOpen: false, request: null })}>
                            Close
                        </Button>
                        {detailModal.request?.status === 'pending' && (
                            <>
                                <Button variant="danger" icon={XIcon} onClick={() => {
                                    setDetailModal({ isOpen: false, request: null });
                                    setRejectModal({ isOpen: true, request: detailModal.request });
                                }}>
                                    Reject
                                </Button>
                                <Button variant="success" icon={Check} onClick={() => {
                                    handleApprove(detailModal.request);
                                    setDetailModal({ isOpen: false, request: null });
                                }}>
                                    Approve
                                </Button>
                            </>
                        )}
                    </div>
                </ModalFooter>
            </Modal>
        </PageContainer>
    );
}

export default RequestsPage;
