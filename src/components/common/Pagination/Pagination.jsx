import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@lib/cn";
import { Select } from "@components/ui";
import "./Pagination.css";

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  className,
}) {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={cn("ds-pagination", className)}>
      <div className="ds-pagination__left">
        <div className="ds-pagination__per-page">
          <span className="ds-pagination__label">Rows per page:</span>
          <Select
            size="sm"
            options={PER_PAGE_OPTIONS.map((opt) => ({
              value: opt,
              label: opt.toString(),
            }))}
            value={perPage}
            onChange={onPerPageChange}
            fullWidth={false}
          />
        </div>
        <div className="ds-pagination__info">
          <span className="ds-pagination__range">
            {startItem}-{endItem}
          </span>
          <span className="ds-pagination__total">
            of {totalItems.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="ds-pagination__right">
        <div className="ds-pagination__controls">
          <button
            type="button"
            className="ds-pagination__btn"
            onClick={() => onPageChange?.(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            type="button"
            className="ds-pagination__btn"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="ds-pagination__pages">
            {getVisiblePages().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="ds-pagination__ellipsis"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "ds-pagination__page",
                    currentPage === page && "ds-pagination__page--active",
                  )}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            className="ds-pagination__btn"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className="ds-pagination__btn"
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
