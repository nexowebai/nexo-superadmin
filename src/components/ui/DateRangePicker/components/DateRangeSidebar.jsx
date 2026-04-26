import React from "react";
import { cn } from "@lib/cn";
import { PRESETS } from "./DateRangeComponents";

export function DateRangeSidebar({ viewMode, setViewMode, handlePreset }) {
  return (
    <div className="drp-sidebar">
      <div className="drp-sidebar-header">Timeframes</div>
      {PRESETS.map((p) => (
        <button
          key={p.label}
          className="drp-preset-btn"
          onClick={() => {
            handlePreset(p);
            setViewMode("preset");
          }}
        >
          {p.label}
        </button>
      ))}
      <button
        className={cn(
          "drp-preset-btn",
          viewMode === "custom" && "active",
        )}
        onClick={() => setViewMode("custom")}
      >
        Custom Range
      </button>
    </div>
  );
}
