import React from "react";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { Input, Select } from "@components/ui";
import DateRangePicker from "@components/ui/DateRangePicker/DateRangePicker";
import { cn } from "@lib/cn";

const PLAN_OPTIONS = [
  { value: "", label: "All Plans" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

export function OrgToolbar({ search, setSearch, tier, setTier, dateRange, setDateRange, viewMode, setViewMode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="w-full md:w-96">
        <Input placeholder="Search by name, ID or email..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} clearable onClear={() => setSearch("")} className="search-input-nexo" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select options={PLAN_OPTIONS} value={tier} onChange={setTier} placeholder="Filter by Plan" className="w-48" icon={Filter} />
        <DateRangePicker initialStartDate={dateRange.startDate} initialEndDate={dateRange.endDate} onChange={setDateRange} align="end" className="w-[280px]" />
        <div className="h-10 w-px bg-border-base mx-1 hidden md:block" />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
}

function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex p-1 bg-subtle rounded-xl border border-base shadow-sm h-11 items-center">
      <ToggleButton active={viewMode === "cards"} onClick={() => setViewMode("cards")} icon={LayoutGrid} />
      <ToggleButton active={viewMode === "table"} onClick={() => setViewMode("table")} icon={List} />
    </div>
  );
}

function ToggleButton({ active, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className={cn("flex items-center justify-center w-10 h-9 rounded-lg transition-all", active ? "bg-surface text-primary shadow-sm border border-base" : "text-secondary hover:text-primary")}>
      <Icon size={18} />
    </button>
  );
}
