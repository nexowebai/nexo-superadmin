import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus } from "lucide-react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, ConfirmModal } from "@components/ui";
import { DataTable } from "@components/common";
import { useAdminsPage } from "../hooks/useAdminsPage";
import { getAdminColumns } from "../components/AdminsTableConfig";

export default function AdminsPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const {
    admins,
    pagination,
    isLoading,
    isDeleting,
    page,
    search,
    setSearch,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    handlePageChange,
    refetch,
  } = useAdminsPage();

  useEffect(() => {
    setHeaderProps({
      title: "Admins",
      action: (
        <Button icon={Plus} onClick={() => navigate("/admins/create")}>
          Add Admin
        </Button>
      ),
    });
  }, [setHeaderProps, navigate]);

  const columns = useMemo(
    () => getAdminColumns({ navigate, openDeleteModal }),
    [navigate, openDeleteModal],
  );

  return (
    <PageContainer>
      <DataTable
        columns={columns}
        data={admins}
        loading={isLoading}
        emptyIcon={Shield}
        emptyTitle="No admins found"
        emptyDescription={
          search ? "Try adjusting your search" : "Create your first admin"
        }
        onRowClick={(admin) => navigate(`/admins/${admin.id}`)}
        showToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        pagination={pagination}
        page={page}
        onPageChange={handlePageChange}
        storageKey="admins-table"
        stickyFirstColumn
        stickyLastColumn
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Admin"
        description={`Are you sure you want to delete ${deleteModal.admin?.full_name || "this admin"}? This action cannot be undone.`}
        confirmText="Delete"
        variant="delete"
        loading={isDeleting}
      />
    </PageContainer>
  );
}
