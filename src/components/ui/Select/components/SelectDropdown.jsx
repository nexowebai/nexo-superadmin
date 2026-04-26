import React from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/cn";
import { SelectOption } from "./SelectComponents";

const getVariants = (isUp) => ({
  hidden: { opacity: 0, y: isUp ? 15 : -15, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", duration: 0.35, bounce: 0 },
  },
  exit: { opacity: 0, y: isUp ? 10 : -10, scale: 0.98, transition: { duration: 0.15 } },
});

export function SelectDropdown({
  dropdownRef,
  coords,
  searchable,
  inputRef,
  search,
  setSearch,
  filteredOptions,
  isSelected,
  multiple,
  renderOption,
  handleSelect,
}) {
  return (
    <motion.div
      key="select-dropdown"
      ref={dropdownRef}
      className={cn("ds-select-portal-menu", coords.isUp && "ds-select-portal-menu--up")}
      /* allowed-inline */
      style={{
        position: "absolute", top: "calc(100% + 8px)", left: 0,
        width: "100%", zIndex: 1000, maxHeight: 300,
        pointerEvents: "auto", transformOrigin: "top",
      }}
      variants={getVariants(false)} initial="hidden" animate="visible" exit="exit"
      onClick={(e) => e.stopPropagation()}
    >
      {searchable && (
        <div className="ds-select-portal-search">
          <input
            ref={inputRef} value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search options..." className="ds-select-portal-search-input"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="ds-select-portal-options" /* allowed-inline */ style={{ maxHeight: 240 }}>
        {filteredOptions.length ? (
          filteredOptions.map((o) => (
            <SelectOption
              key={o.value} option={o} isSelected={isSelected(o.value)}
              multiple={multiple} renderOption={renderOption} onClick={handleSelect}
            />
          ))
        ) : (
          <div className="ds-select-portal-empty">No options found</div>
        )}
      </div>
    </motion.div>
  );
}
