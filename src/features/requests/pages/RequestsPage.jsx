import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, RefreshCw, Check, XIcon, Building2, Calendar, MessageSquare } from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import { StatusBadge, EmptyState, Select } from '@components/common';
import Button from '@components/ui/Button';
import { ConfirmModal } from '@components/ui/Modal';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { useRequests, useApproveRequest, useRejectRequest } from '../../hooks/';
import { formatRelativeTime } from '@utils/format';
import notify from '@utils/notify';
import '../css/requests.css';

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

function RequestCardSkeleton() {
    return (
        <div className="request-card request-card--skeleton">
            <div className="request-header">
                <div className="request-org">
                    <Skeleton width="44px" height="44px" borderRadius="12px" />
                    <div>
                        <Skeleton width="160px" height="18px" />
                        <Skeleton width="120px" height="14px" style={{ marginTop: 6 }} />
                    </div>
                </div>
                <Skeleton width="80px" height="26px" borderRadius="6px" />
            </div>
            <div className="request-body">
                <Skeleton width="140px" height="14px" />
            </div>
            <div className="request-actions">
                <Skeleton width="100px" height="36px" borderRadius="8px" />
                <Skeleton width="100px" height="36px" borderRadius="8px" />
            </div>
        </div>
    );
}

function RequestsPage() {
    const { setHeaderProps } = useLayout();
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [rejectModal, setRejectModal] = useState({ isOpen: false, request: null });
    const [rejectReason, setRejectReason] = useState('');

    const { data, isLoading, refetch } = useRequests({ page, limit: 20, status: status || undefined });
    const { mutate: approveRequest, isPending: approving } = useApproveRequest();
    const { mutate: rejectRequest, isPending: rejecting } = useRejectRequest();

    const { requests = [], pagination = { page: 1, limit: 20, total: 0, pages: 1 } } = data || {};

    useEffect(() => {
        setHeaderProps({
            title: "Organization Requests",
            action: (
                <div className="flex items-center gap-3">
                    <Select
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={(v) => { setStatus(v); setPage(1); }}
                        placeholder="Filter by Status"
                    />
                    <Button variant="secondary" icon={RefreshCw} onClick={refetch} loading={isLoading}>
                        Refresh
                    </Button>
                </div>
            )
        });
    }, [setHeaderProps, status, isLoading, refetch]);

    const handleApprove = useCallback((id) => {
        approveRequest(id, { onSuccess: refetch });
    }, [approveRequest, refetch]);

    const handleRejectConfirm = useCallback(() => {
        if (!rejectModal.request) return;
        if (!rejectReason.trim()) {
            notify.error('Please provide a reason for rejection');
            return;
        }

        rejectRequest(
            { id: rejectModal.request.id, reason: rejectReason },
            {
                onSuccess: () => {
                    setRejectModal({ isOpen: false, request: null });
                    setRejectReason('');
                    refetch();
                },
            }
        );
    }, [rejectModal.request, rejectReason, rejectRequest, refetch]);

    return (
        <PageContainer>
            <div className="requests-grid">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <RequestCardSkeleton key={i} />)
                ) : requests.length === 0 ? (
                    <div className="requests-empty">
                        <EmptyState
                            icon={FileCheck}
                            title="No requests found"
                            description={status ? 'Try changing the filter' : 'No pending organization requests'}
                        />
                    </div>
                ) : (
                    requests.map((req) => (
                        <motion.div
                            key={req.id}
                            className="request-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="request-header">
                                <div className="request-org">
                                    <div className="request-org__icon">
                                        <Building2 size={20} />
                                    </div>
                                    <div className="request-org__info">
                                        <h4>{req.organization_name}</h4>
                                        <span>{req.contact_email}</span>
                                    </div>
                                </div>
                                <StatusBadge status={req.status} />
                            </div>

                            <div className="request-body">
                                <div className="request-info">
                                    <Calendar size={14} />
                                    <span>Requested {formatRelativeTime(req.created_at)}</span>
                                </div>
                                {req.message && (
                                    <div className="request-message">
                                        <MessageSquare size={14} />
                                        <span>{req.message}</span>
                                    </div>
                                )}
                            </div>

                            {req.status === 'pending' && (
                                <div className="request-actions">
                                    <Button size="sm" icon={Check} onClick={() => handleApprove(req.id)} loading={approving}>
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        icon={XIcon}
                                        onClick={() => setRejectModal({ isOpen: true, request: req })}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}

                            {req.status === 'rejected' && req.rejection_reason && (
                                <div className="request-rejection">
                                    <strong>Rejection reason:</strong>
                                    <p>{req.rejection_reason}</p>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {pagination.pages > 1 && (
                <div className="requests-pagination">
                    <span className="pagination-info">Page {page} of {pagination.pages}</span>
                    <div className="pagination-btns">
                        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                        <button disabled={page === pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={rejectModal.isOpen}
                onClose={() => { setRejectModal({ isOpen: false, request: null }); setRejectReason(''); }}
                onConfirm={handleRejectConfirm}
                title="Reject Request"
                description={
                    <div className="modal-form">
                        <p style={{ marginBottom: 16, color: 'var(--ds-text-secondary)' }}>
                            Rejecting request from <strong>{rejectModal.request?.organization_name}</strong>
                        </p>
                        <div className="form-field">
                            <label>Reason for rejection</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter reason..."
                                rows={4}
                            />
                        </div>
                    </div>
                }
                confirmText="Reject Request"
                variant="delete"
                loading={rejecting}
            />
        </PageContainer>
    );
}

export default RequestsPage;
