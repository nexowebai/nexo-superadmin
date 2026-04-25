import React from "react";
import { Search, Filter, RefreshCw, RotateCcw } from "lucide-react";
import { Button, Card } from "@components/ui";

const CustomSearchIcon = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="var(--primary-soft)" />
    <circle cx="45" cy="45" r="18" stroke="var(--primary)" strokeWidth="3" />
    <path d="M58 58L72 72" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="25" cy="25" r="4" fill="var(--primary)" opacity="0.2" />
    <circle cx="75" cy="25" r="4" fill="var(--primary)" opacity="0.2" />
    <circle cx="25" cy="75" r="4" fill="var(--primary)" opacity="0.2" />
  </svg>
);

const CustomFilterIcon = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="var(--warning-soft)" />
    <path d="M30 35H70L55 55V75L45 80V55L30 35Z" stroke="var(--warning)" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="75" cy="75" r="5" fill="var(--warning)" opacity="0.3" />
    <circle cx="25" cy="25" r="5" fill="var(--warning)" opacity="0.3" />
  </svg>
);

export function SearchEmptyState({
  searchTerm,
  type = "search", // 'search' or 'filter'
  onReset
}) {
  const isFilter = type === "filter";

  return (
    <Card variant="nx" className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-300 bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-base)]">
      <div className="mb-8 p-6 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-base)] shadow-sm">
        {isFilter ? <CustomFilterIcon /> : <CustomSearchIcon />}
      </div>

      <div className="space-y-3 mb-10">
        <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
          {isFilter
            ? "No matches for active filters"
            : (searchTerm ? `No results for "${searchTerm}"` : "No matches found")}
        </h3>
        {/* Improved visibility for dark mode using a more reliable text token and opacity */}
        <p className="text-[var(--text-secondary)] dark:text-slate-400 text-base max-w-md mx-auto leading-relaxed">
          {isFilter
            ? "Your current filter settings didn't match any records. Try adjusting the status or date range."
            : "We couldn't find what you're looking for. Please check your spelling or try different keywords."}
        </p>
      </div>

      {onReset && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            icon={isFilter ? RotateCcw : RefreshCw}
            className={`font-bold rounded-xl h-12 px-8 border-2 ${isFilter ? 'text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-soft)]' : 'text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary-soft)]'}`}
          >
            {isFilter ? "Reset Filters" : "Clear Search"}
          </Button>
        </div>
      )}
    </Card>
  );
}
