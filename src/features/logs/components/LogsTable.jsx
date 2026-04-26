import React, { useMemo } from "react";
import { FileText } from "lucide-react";
import { DataTable } from "@components/common";
import { Select, SearchEmptyState } from "@components/ui";
import { LEVEL_OPTIONS, TYPE_OPTIONS } from "../constants/logData";
import notify from "@utils/notify";
import { useLogTableColumns } from "./LogsTableColumns";

export function LogsTable({
  data, loading, pagination, page, onPageChange,
  search, onSearchChange, level, setLevel,
  logType, setLogType, onRefresh, onViewDetail,
}) {
  const columns = useLogTableColumns(onViewDetail);

  return (
    <DataTable
      columns={columns} data={data} loading={loading}
      pagination={pagination} page={page} onPageChange={onPageChange}
      emptyIcon={FileText} emptyTitle="No activity logs found"
      emptyDescription="System events will appear here as they occur"
      showToolbar search={search} onSearchChange={onSearchChange}
      onRefresh={onRefresh} onExportCSV={() => notify.info("Export started")}
      stickyFirstColumn stickyLastColumn
      renderEmpty={
        data.length === 0 && !loading ? (
          <SearchEmptyState
            onReset={() => { onSearchChange(""); setLevel(""); setLogType(""); }}
            searchTerm={search}
            type={search ? "search" : level || logType ? "filter" : "search"}
          />
        ) : null
      }
      filters={
        <LogTableFilters 
          level={level} setLevel={setLevel} 
          logType={logType} setLogType={setLogType} 
        />
      }
    />
  );
}

function LogTableFilters({ level, setLevel, logType, setLogType }) {
  return (
    <>
      <Select options={LEVEL_OPTIONS} value={level} onChange={setLevel} placeholder="LogLevel" className="w-36" />
      <Select options={TYPE_OPTIONS} value={logType} onChange={setLogType} placeholder="Category" className="w-36" />
    </>
  );
}
