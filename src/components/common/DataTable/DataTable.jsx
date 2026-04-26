import { useMemo, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import TableToolbar from "./components/TableToolbar";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useCopyToClipboard } from "@hooks/useCopyToClipboard";
import { TableHead } from "./components/TableHead";
import { TableBody } from "./components/TableBody";
import { TablePagination } from "./components/TablePagination";
import { useDataTableColumns } from "./hooks/useDataTableColumns";
import "./styles/index.css";

export function DataTable({
  columns: userColumns,
  data = [],
  loading = false,
  emptyIcon,
  emptyTitle = "No data found",
  emptyDescription = "",
  onRowClick,
  stickyFirstColumn = true,
  stickyLastColumn = true,
  storageKey,
  title,
  showToolbar = false,
  fileName,
  search,
  onSearchChange,
  onRefresh,
  filters,
  onExportCSV,
  onExportPDF,
  pagination,
  page = 1,
  onPageChange,
  renderEmpty,
}) {
  const tableRef = useRef(null);
  const [copiedId, copyToClipboard] = useCopyToClipboard();

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    storageKey ? `dt-cols-${storageKey}` : null,
    {},
  );
  const [columnSizing, setColumnSizing] = useLocalStorage(
    storageKey ? `dt-widths-${storageKey}` : null,
    {},
  );

  const columns = useDataTableColumns({ userColumns, copiedId, copyToClipboard });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    state: { columnVisibility, columnSizing },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const handleRowClick = useCallback(
    (row, e) => {
      const target = e.target;
      if (
        target.closest(".dt-actions") ||
        target.closest("button") ||
        target.closest(".ds-select__trigger")
      )
        return;

      onRowClick?.(row);
    },
    [onRowClick],
  );

  const visibleColumns = useMemo(
    () =>
      Object.keys(columnVisibility).filter(
        (key) => columnVisibility[key] !== false,
      ),
    [columnVisibility],
  );

  return (
    <div className="dt-root">
      {showToolbar && (
        <TableToolbar
          title={title}
          data={data}
          columns={userColumns}
          visibleColumns={visibleColumns}
          onColumnToggle={(key) =>
            setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
          }
          fileName={fileName}
          printRef={tableRef}
          search={search}
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
          loading={loading}
          filters={filters}
          onExportCSV={onExportCSV}
          onExportPDF={onExportPDF}
        />
      )}

      {renderEmpty && data.length === 0 && !loading ? (
        <div className="dt-empty-surface">{renderEmpty}</div>
      ) : (
        <div className="dt-container">
          <div className="dt-wrapper" ref={tableRef}>
            <table className="dt-table">
              <TableHead
                table={table}
                stickyFirstColumn={stickyFirstColumn}
                stickyLastColumn={stickyLastColumn}
              />
              <TableBody
                table={table}
                loading={loading}
                onRowClick={onRowClick}
                handleRowClick={handleRowClick}
                stickyFirstColumn={stickyFirstColumn}
                stickyLastColumn={stickyLastColumn}
                emptyIcon={emptyIcon}
                emptyTitle={emptyTitle}
                emptyDescription={emptyDescription}
                renderEmpty={renderEmpty}
              />
            </table>
          </div>
        </div>
      )}

      <TablePagination
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        handleRowsChange={(limit) => onPageChange?.(1, limit)}
      />
    </div>
  );
}

export default DataTable;
