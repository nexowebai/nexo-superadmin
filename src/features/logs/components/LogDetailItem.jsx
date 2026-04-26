import React from "react";

export const LogDetailItem = ({ label, value, mono = false }) => {
  if (!value) return null;
  return (
    <div className="modal-detail-item">
      <span className="modal-detail-item__label">{label}</span>
      <div className="modal-detail-item__value">
        <span className={mono ? "font-mono text-[13px]" : ""}>{value}</span>
      </div>
    </div>
  );
};
