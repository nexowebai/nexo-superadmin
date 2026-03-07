import { Search, X, RefreshCw, Columns3, Download, Printer, FileSpreadsheet } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { SearchBar } from "@components/common";
import { Select } from "@components/ui";

export default function TableToolbar({
  data = [],
  columns = [],
  visibleColumns = [],
  onColumnToggle,
  fileName = "data",
  printRef,
  // Search Props
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  // Refresh & Loading
  onRefresh,
  loading = false,
  // Custom Filters Slot
  filters,
  // Export Handlers
  onExportCSV,
  onExportPDF,
}) {
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: fileName,
  });

  const handleExportCSV = () => {
    if (onExportCSV) return onExportCSV();
    const csv = Papa.unparse(
      data.map((row) => {
        const mapped = {};
        columns.forEach((col) => {
          if (col.key !== "actions" && visibleColumns.includes(col.key)) {
            mapped[col.label] = row[col.key];
          }
        });
        return mapped;
      })
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${fileName}.csv`);
  };

  const handleExportPDF = () => {
    if (onExportPDF) return onExportPDF();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, `${fileName}.json`);
  };

  const columnOptions = columns
    .filter((c) => c.key !== "actions")
    .map((c) => ({ label: c.label, value: c.key }));

  return (
    <div className="table-toolbar">
      <div className="toolbar-left">
        {onSearchChange && (
          <SearchBar
            placeholder={searchPlaceholder}
            value={search || ""}
            onSearch={onSearchChange}
            size="md"
            className="toolbar-search-pro"
            showShortcut={false}
          />
        )}
      </div>

      <div className="toolbar-right">
        {filters && <div className="toolbar-filters">{filters}</div>}

        <div className="toolbar-actions">
          <Select
            options={columnOptions}
            value={visibleColumns}
            multiple
            onChange={(newValues) => {
              const currentSet = new Set(visibleColumns);
              const newSet = new Set(newValues);
              let toggledKey = null;
              for (const key of currentSet) {
                if (!newSet.has(key)) {
                  toggledKey = key;
                  break;
                }
              }
              if (!toggledKey) {
                for (const key of newSet) {
                  if (!currentSet.has(key)) {
                    toggledKey = key;
                    break;
                  }
                }
              }
              if (toggledKey) onColumnToggle(toggledKey);
            }}
            placeholder="Columns"
            icon={Columns3}
            fullWidth={false}
            className="toolbar-column-select"
            renderValue={() => (
              <span className="column-select-value">
                {visibleColumns.length} Columns
              </span>
            )}
          />

          <div className="toolbar-divider" />

          <button
            type="button"
            className="toolbar-btn toolbar-btn--pdf"
            onClick={handleExportPDF}
            title="Export PDF"
          >
            <Download size={18} />
          </button>

          <button
            type="button"
            className="toolbar-btn toolbar-btn--csv"
            onClick={handleExportCSV}
            title="Export CSV"
          >
            <FileSpreadsheet size={18} />
          </button>

          <button
            type="button"
            className="toolbar-btn toolbar-btn--print"
            onClick={handlePrint}
            title="Print Table"
          >
            <Printer size={18} />
          </button>

        </div>
      </div>
    </div>
  );
}
