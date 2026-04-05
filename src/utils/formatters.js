import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

export function formatDate(date, formatStr = "MMM dd, yyyy") {
  if (!date) return "-";
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "-";
  return format(parsed, formatStr);
}

export function formatDateTime(date) {
  return formatDate(date, "MMM dd, yyyy HH:mm");
}

export function formatRelative(date) {
  if (!date) return "-";
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "-";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function formatNumber(num, options = {}) {
  if (num == null) return "-";
  return new Intl.NumberFormat("en-US", options).format(num);
}

export function formatCurrency(amount, currency = "USD") {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value) {
  if (value == null) return "-";
  return `${value.toFixed(1)}%`;
}

export function formatCompact(num) {
  if (num == null) return "-";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

export function truncateText(text, maxLength = 50) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
