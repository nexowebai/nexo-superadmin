import { flexRender } from "@tanstack/react-table";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { cn } from "@lib/cn";

export const TableBody = ({
  table,
  loading,
  onRowClick,
  handleRowClick,
  stickyFirstColumn,
  stickyLastColumn,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
}) => {
  if (loading) {
    return (
      <tbody>
        {Array.from({ length: 8 }).map((_, rIdx) => (
          <tr key={rIdx} className="dt-row dt-row--skeleton">
            {table.getVisibleLeafColumns().map((col, cIdx) => (
              <td
                key={cIdx}
                className={cn(
                  "dt-td",
                  cIdx === 0 &&
                    stickyFirstColumn &&
                    "dt-td--sticky-left",
                  col.id === "actions" &&
                    stickyLastColumn &&
                    "dt-td--sticky-right",
                )}
              >
                {col.id === "actions" ? (
                  <div className="dt-actions">
                    <Skeleton width="32px" height="32px" />
                    <Skeleton width="32px" height="32px" />
                    <Skeleton width="32px" height="32px" />
                  </div>
                ) : (
                  <Skeleton width="80%" height="18px" />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={table.getVisibleLeafColumns().length}>
            <div className="dt-empty">
              {EmptyIcon && (
                <div className="dt-empty-icon">
                  <EmptyIcon size={48} />
                </div>
              )}
              <h4 className="dt-empty-title">{emptyTitle}</h4>
              <p className="dt-empty-description">{emptyDescription}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={cn("dt-row", onRowClick && "dt-row--clickable")}
          onClick={(e) => handleRowClick(row.original, e)}
        >
          {row.getVisibleCells().map((cell, colIdx) => (
            <td
              key={cell.id}
              className={cn(
                "dt-td",
                colIdx === 0 &&
                  stickyFirstColumn &&
                  "dt-td--sticky-left",
                cell.column.id === "actions" &&
                  stickyLastColumn &&
                  "dt-td--sticky-right",
                cell.column.columnDef.meta?.align &&
                  `dt-td--${cell.column.columnDef.meta.align}`,
              )}
              style={{
                width: cell.column.getSize(),
                minWidth: cell.column.columnDef.minSize,
              }}
            >
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
