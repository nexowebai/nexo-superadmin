import { useMemo, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Copy, Check } from "lucide-react";
import TableToolbar from "./TableToolbar";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useCopyToClipboard } from "@hooks/useCopyToClipboard";
import { CellTooltip } from "./CellTooltip";
import { TableHead } from "./components/TableHead";
import { TableBody } from "./components/TableBody";
import { TablePagination } from "./components/TablePagination";
import "./DataTable.css";

function DataTable({
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

  const columns = useMemo(() => {
    return userColumns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: col.label,
      cell: (info) => {
        const value = info.getValue();
        const row = info.row.original;

        if (col.key === "actions") {
          return <div className="dt-actions">{col.render?.(value, row)}</div>;
        }

        let content;
        if (col.copyable && value) {
          content = (
            <div className="dt-copyable">
              <code className="dt-code">{value}</code>
              <button
                className="dt-action-btn dt-copy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(value, `${row.id}-${col.key}`);
                }}
              >
                {copiedId === `${row.id}-${col.key}` ? (
                  <Check size={12} />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            </div>
          );
        } else if (col.render) {
          content = col.render(value, row);
        } else {
          content = value ?? "—";
        }

        if (typeof content === "string" || typeof content === "number") {
          return <CellTooltip content={content} />;
        }
        return content;
      },
      enableSorting: col.sortable !== false && col.key !== "actions",
      enableResizing: col.resizable !== false && col.key !== "actions",
      size: col.width || 180,
      minSize: col.minWidth || 120,
      meta: { align: col.align },
    }));
  }, [userColumns, copiedId, copyToClipboard]);

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

      // Check for ds-select__trigger or other interactive elements to prevent row click
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
