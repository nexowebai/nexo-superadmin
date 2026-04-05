import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./format";

/**
 * Exports data to CSV
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column definitions { key, label, render? }
 * @param {String} filename - Filename without extension
 */
export const exportToCSV = (data, columns, filename = "export") => {
  if (!data.length) return;

  // Filter out action columns or hidden columns
  const exportableColumns = columns.filter(
    (col) => col.key !== "actions" && col.key !== "menu",
  );

  const headers = exportableColumns.map((col) => col.label);
  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = exportableColumns.map((col) => {
      let val = row[col.key];

      // Handle specific formatting if needed, though usually raw data is better for CSV
      if (col.key === "created_at" || col.key === "updated_at") {
        val = formatDate(val);
      }
      if (typeof val === "string") {
        // Escape quotes
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val ?? "";
    });
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Exports data to PDF
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column definitions
 * @param {Object} options - { title, subtitle, dateRange, filename }
 */
export const exportToPDF = (data, columns, options = {}) => {
  if (!data.length) return;
  const {
    title = "DataStride Report",
    subtitle = "List Export",
    dateRange = "All Time",
    filename = "export",
  } = options;

  const doc = new jsPDF({ orientation: "landscape" });
  const exportableColumns = columns.filter((col) => col.key !== "actions");

  // Header Data
  const tableHead = [exportableColumns.map((col) => col.label)];
  const tableBody = data.map((row) =>
    exportableColumns.map((col) => {
      let val = row[col.key];
      if (col.key === "created_at") val = formatDate(val);
      return val ?? "—";
    }),
  );

  // Header drawing function
  const drawHeader = (data) => {
    const doc = data.doc;
    const width = doc.internal.pageSize.getWidth();

    // 1. Top Middle: Organization Name / App Name
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("DataStride", width / 2, 15, { align: "center" });

    // 2. Row Below
    doc.setFontSize(10);
    doc.setTextColor(100);

    // Left: Table Name (Subtitle)
    doc.text(subtitle, 14, 25);

    // Middle: Printed Date & Time
    const printDate = new Date().toLocaleString();
    doc.text(`Generated: ${printDate}`, width / 2, 25, { align: "center" });

    // Right: Data Duration
    doc.text(`Duration: ${dateRange}`, width - 14, 25, { align: "right" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(14, 28, width - 14, 28);
  };

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 35,
    theme: "grid",
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [40, 40, 40],
      fontStyle: "bold",
    },
    styles: { fontSize: 9, cellPadding: 3 },
    didDrawPage: drawHeader,
    margin: { top: 35 },
  });

  doc.save(`${filename}_${new Date().toISOString().split("T")[0]}.pdf`);
};
