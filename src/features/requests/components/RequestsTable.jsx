import { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { DataTable, SearchBar } from '@components/common';
import { Select } from '@components/ui';
import { STATUS_OPTIONS, REQUEST_TABLE_CONFIG } from '../constants/requestData';
import { useRequestColumns } from './RequestColumns';
import { RequestDetailsModal, RejectRequestModal } from './RequestModals';

export default function RequestsTable({
    data, loading, refetch, page, pagination, onPageChange,
    search, setSearch, status, setStatus, handleApprove, handleReject
}) {
    const [rejectModal, setRejectModal] = useState({ isOpen: false, request: null });
    const [detailModal, setDetailModal] = useState({ isOpen: false, request: null });

    const columns = useRequestColumns({
        handleApprove: (req) => handleApprove(req),
        setRejectModal,
        setDetailModal
    });

    return (
        <div className="requests-table-container">
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagination={pagination}
                page={page}
                onPageChange={onPageChange}
                emptyIcon={FileCheck}
                {...REQUEST_TABLE_CONFIG}
                showToolbar
                search={search}
                onSearchChange={setSearch}
                onRefresh={refetch}
                filters={
                    <Select
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={(v) => { setStatus(v); }}
                        placeholder="Filter Status"
                        className="w-48"
                    />
                }
            />

            <RequestDetailsModal
                isOpen={detailModal.isOpen}
                onClose={() => setDetailModal({ isOpen: false, request: null })}
                request={detailModal.request}
                onApprove={handleApprove}
                onReject={(req) => setRejectModal({ isOpen: true, request: req })}
            />

            <RejectRequestModal
                isOpen={rejectModal.isOpen}
                onClose={() => setRejectModal({ isOpen: false, request: null })}
                request={rejectModal.request}
                onConfirm={handleReject}
            />
        </div>
    );
}
