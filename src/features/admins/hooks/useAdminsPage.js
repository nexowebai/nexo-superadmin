import { useState, useCallback, useMemo } from "react";
import { useAdmins, useDeleteAdmin } from "./useAdmins";
import notify from "@utils/notify";

export function useAdminsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    admin: null,
  });

  const { data, isLoading, refetch } = useAdmins({
    page,
    limit,
    search: search || undefined,
  });
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  const admins = useMemo(() => data?.admins || [], [data]);
  const pagination = useMemo(
    () => data?.pagination || { page: 1, limit, total: 0, pages: 1 },
    [data, limit],
  );

  const handlePageChange = useCallback(
    (newPage, newLimit) => {
      if (newLimit !== undefined && newLimit !== limit) {
        setLimit(newLimit);
        setPage(1);
      } else {
        setPage(newPage);
      }
    },
    [limit],
  );

  const openDeleteModal = useCallback(
    (admin) => setDeleteModal({ isOpen: true, admin }),
    [],
  );
  const closeDeleteModal = useCallback(
    () => setDeleteModal({ isOpen: false, admin: null }),
    [],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal.admin) return;

    notify.promise(
      new Promise((resolve, reject) => {
        deleteAdmin(deleteModal.admin.id, {
          onSuccess: () => {
            closeDeleteModal();
            refetch();
            resolve();
          },
          onError: reject,
        });
      }),
      {
        loading: "Deleting admin...",
        success: "Admin deleted successfully",
        error: "Failed to delete admin",
      },
    );
  }, [deleteModal.admin, deleteAdmin, refetch, closeDeleteModal]);

  return {
    admins,
    pagination,
    isLoading,
    isDeleting,
    page,
    limit,
    search,
    setSearch,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    handlePageChange,
    refetch,
  };
}
