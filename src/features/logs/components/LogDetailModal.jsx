import React from "react";
import { Terminal, Hash, Copy, Lock } from "lucide-react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button } from "@components/ui";
import notify from "@utils/notify";
import { LogDetailItem } from "./LogDetailItem";
import { LEVEL_CONFIG } from "../constants/logData";
import "../styles/logs.css";

export default function LogDetailModal({ log, isOpen, onClose }) {
  if (!log) return null;

  const config = LEVEL_CONFIG[log.log_level] || LEVEL_CONFIG.info;
  const SeverityIcon = config.icon;
  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString(undefined, { dateStyle: "long" }),
      time: d.toLocaleTimeString([], { hour12: true }),
    };
  };

  const { date, time } = formatDateTime(log.created_at);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <ModalHeader>
        <div className="modal-form-header">
          <div className="log-level-icon" style={{ backgroundColor: config.bg, color: config.color }}>
            <SeverityIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <ModalTitle>System Audit Trace</ModalTitle>
            <ModalDescription className="flex items-center gap-1.5">
              <Hash size={12} strokeWidth={3} /> Ref: {log.id}
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        <LogSummary message={log.message} color={config.color} />
        
        <div className="space-y-4">
          <SectionTitle label="Initiator Context" />
          <div className="modal-detail-grid">
            <LogDetailItem label="Email Identity" value={log.email} />
            <LogDetailItem label="Access Role" value={log.user_role || "Super Admin"} />
            <LogDetailItem label="Entity" value={log.organization_name || "System Central"} />
            <LogDetailItem label="Resource origin" value={log.ip_address === "::1" ? "Localhost (::1)" : log.ip_address} mono />
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle label="Temporal Data" />
          <div className="modal-detail-grid">
            <LogDetailItem label="Audit Date" value={date} />
            <LogDetailItem label="Timestamp" value={time} mono />
          </div>
        </div>

        {log.temp_password && <TempPasswordBox password={log.temp_password} />}
      </ModalBody>

      <ModalFooter>
        <div className="modal-form-footer modal-form-footer--single">
          <Button variant="secondary" onClick={onClose} fullWidth className="h-11 font-bold">
            Dismiss Audit Trace
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

function LogSummary({ message, color }) {
  return (
    <div className="log-summary-container" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-2">
        <Terminal size={14} className="text-muted" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Activity Summary</span>
      </div>
      <p className="text-sm font-bold text-primary leading-relaxed m-0">{message}</p>
    </div>
  );
}

function SectionTitle({ label }) {
  return <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">{label}</h4>;
}

function TempPasswordBox({ password }) {
  const copy = () => {
    navigator.clipboard.writeText(password);
    notify.success("Identity token copied");
  };

  return (
    <div className="log-temp-password-box">
      <div className="flex items-center gap-4">
        <div className="log-temp-password-icon">
          <Lock size={18} />
        </div>
        <div>
          <p className="log-temp-password-label">Temporary Credential</p>
          <code className="log-temp-password-code">{password}</code>
        </div>
      </div>
      <Button variant="ghost" className="h-9 px-4 log-copy-btn-danger" onClick={copy}>
        <Copy size={14} className="mr-2" /> Copy
      </Button>
    </div>
  );
}
