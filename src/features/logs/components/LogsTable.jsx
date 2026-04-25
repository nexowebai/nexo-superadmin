import React, { useMemo } from "react";
import {
  User,
  Building2,
  Calendar,
  Clock,
  Terminal,
  FileText,
} from "lucide-react";
import { DataTable, TableActions } from "@components/common";
import { Select, SearchEmptyState } from "@components/ui";
import { LevelBadge, TypeBadge } from "./LogBadges";
import { LEVEL_OPTIONS, TYPE_OPTIONS } from "../constants/logData";
import notify from "@utils/notify";

export function LogsTable({
  data,
  loading,
  pagination,
  page,
  onPageChange,
  search,
  onSearchChange,
  level,
  setLevel,
  logType,
  setLogType,
  onRefresh,
  onViewDetail,
}) {
  const columns = useMemo(
    () => [
      {
        key: "log_level",
        label: "Level",
        width: 120,
        render: (val) => <LevelBadge level={val} />,
      },
      {
        key: "log_type",
        label: "Category",
        width: 130,
        render: (val) => <TypeBadge type={val} />,
      },
      {
        key: "email",
        label: "Initiator",
        width: 200,
        render: (val) => (
          <div className="flex items-center gap-2 text-primary font-bold text-[13px]">
            <User size={12} className="text-muted/60" />
            <span className="truncate">{val || "System"}</span>
          </div>
        ),
      },
      {
        key: "organization_name",
        label: "Context",
        width: 180,
        render: (val) => (
          <div className="flex items-center gap-2 text-secondary font-bold text-[12px]">
            <Building2 size={12} className="text-muted/60" />
            <span className="truncate">{val || "System"}</span>
          </div>
        ),
      },
      {
        key: "created_at",
        label: "Timestamp",
        width: 180,
        render: (val) => (
          <div className="flex flex-col gap-0.5 opacity-70">
            <div className="flex items-center gap-1.5 text-secondary font-bold text-[11px]">
              <Calendar size={11} className="text-muted" />
              <span>{new Date(val).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted font-mono text-[10px] font-bold">
              <Clock size={11} />
              <span>
                {new Date(val).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "message",
        label: "Summary",
        minWidth: 350,
        render: (val) => (
          <span className="text-[13px] font-medium text-secondary/80 line-clamp-1">
            {val}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: 100,
        align: "right",
        render: (_, row) => (
          <TableActions
            actions={[
              {
                label: "Audit",
                icon: Terminal,
                variant: "info",
                onClick: () => onViewDetail(row),
              },
            ]}
          />
        ),
      },
    ],
    [onViewDetail],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      pagination={pagination}
      page={page}
      onPageChange={onPageChange}
      emptyIcon={FileText}
      emptyTitle="No activity logs found"
      emptyDescription="System events will appear here as they occur"
      showToolbar
      search={search}
      onSearchChange={onSearchChange}
      onRefresh={onRefresh}
      onExportCSV={() => notify.info("Export started")}
      stickyFirstColumn={true}
      stickyLastColumn={true}
      renderEmpty={
        data.length === 0 && !loading ? (
          <SearchEmptyState
            onReset={() => {
              onSearchChange("");
              setLevel("");
              setLogType("");
            }}
            searchTerm={search}
            type={search ? "search" : (level || logType ? "filter" : "search")}
          />
        ) : null
      }
      filters={
        <>
          <Select
            options={LEVEL_OPTIONS}
            value={level}
            onChange={setLevel}
            placeholder="LogLevel"
            className="w-36"
          />
          <Select
            options={TYPE_OPTIONS}
            value={logType}
            onChange={setLogType}
            placeholder="Category"
            className="w-36"
          />
        </>
      }
    />
  );
}
