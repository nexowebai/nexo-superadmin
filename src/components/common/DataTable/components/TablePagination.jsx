import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Select } from "@components/ui";
import { cn } from "@lib/cn";

export const TablePagination = ({
  pagination,
  page,
  onPageChange,
  handleRowsChange,
}) => {
  if (!pagination || !onPageChange || pagination.total === 0) return null;

  return (
    <div className="dt-pagination">
      <div className="dt-pagination__left">
        <div className="dt-rows-per-page">
          <span className="dt-rows-per-page__label">Rows:</span>
          <Select
            options={[
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
            value={pagination.limit}
            onChange={handleRowsChange}
            fullWidth={false}
          />
        </div>
        <div className="dt-pagination__info">
          Showing{" "}
          <span className="dt-pagination__info--bold">
            {(page - 1) * pagination.limit + 1}
          </span>{" "}
          -{" "}
          <span className="dt-pagination__info--bold">
            {Math.min(page * pagination.limit, pagination.total)}
          </span>{" "}
          of{" "}
          <span className="dt-pagination__info--bold">
            {pagination.total}
          </span>
        </div>
      </div>

      <div className="dt-pagination__right">
        <nav className="dt-pagination__nav">
          <button
            className="dt-nav-btn"
            disabled={page === 1}
            onClick={() => onPageChange(1, pagination.limit)}
            title="First Page"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            className="dt-nav-btn"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1, pagination.limit)}
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="dt-page-numbers">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.pages ||
                  Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ell-${i}`} className="dt-page-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={cn(
                      "dt-page-btn",
                      page === p && "dt-page-btn--active",
                    )}
                    onClick={() => onPageChange(p, pagination.limit)}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>

          <button
            className="dt-nav-btn"
            disabled={page === pagination.pages}
            onClick={() => onPageChange(page + 1, pagination.limit)}
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="dt-nav-btn"
            disabled={page === pagination.pages}
            onClick={() => onPageChange(pagination.pages, pagination.limit)}
            title="Last Page"
          >
            <ChevronsRight size={18} />
          </button>
        </nav>
      </div>
    </div>
  );
};
