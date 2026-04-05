import React, { useMemo } from "react";
import { StatusSelect } from "@components/ui";

export const StatusDropdown = ({ value, onChange, disabled }) => {
  const options = useMemo(
    () => [
      { value: "active", label: "Active", variant: "success" },
      { value: "pending", label: "Pending", variant: "warning" },
      { value: "disabled", label: "Disabled", variant: "danger" },
    ],
    [],
  );

  return (
    <StatusSelect
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      size="sm"
    />
  );
};
