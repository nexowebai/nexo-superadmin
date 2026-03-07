import React from 'react';
import {
  Mail, Shield, Building2, Clock, Server, AlertCircle, Calendar, Lock, Terminal,
  Activity, Hash, Globe, User, Copy
} from "lucide-react";
import {
  Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button
} from "@components/ui";
import notify from "@utils/notify";

const levelConfig = {
  info: { color: "var(--info)", bg: "var(--info-soft)", icon: Terminal, label: "Information" },
  success: { color: "var(--success)", bg: "var(--success-soft)", icon: Activity, label: "Success" },
  warn: { color: "var(--warning)", bg: "var(--warning-soft)", icon: AlertCircle, label: "Warning" },
  warning: { color: "var(--warning)", bg: "var(--warning-soft)", icon: AlertCircle, label: "Warning" },
  error: { color: "var(--error)", bg: "var(--error-soft)", icon: Shield, label: "Critical" },
};

const DetailItem = ({ icon: Icon, label, value, mono = false }) => {
  if (!value) return null;
  return (
    <div className="modal-detail-item">
      <span className="modal-detail-item__label">{label}</span>
      <div className="modal-detail-item__value">
        <Icon size={14} className="text-muted" />
        <span className={mono ? "font-mono text-[13px]" : ""}>{value}</span>
      </div>
    </div>
  );
};

export default function LogDetailModal({ log, isOpen, onClose }) {
  if (!log) return null;

  const config = levelConfig[log.log_level] || levelConfig.info;
  const SeverityIcon = config.icon;

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(undefined, { dateStyle: 'long' }),
      time: date.toLocaleTimeString([], { hour12: true })
    };
  };

  const { date, time } = formatDateTime(log.created_at);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <ModalHeader>
        <div className="modal-form-header">
          <div
            className="modal-form-header__icon"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            <SeverityIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <ModalTitle>System Audit Trace</ModalTitle>
            <ModalDescription className="flex items-center gap-1.5">
              <Hash size={12} strokeWidth={3} />
              Ref: {log.id}
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        <div className="bg-bg-elevated border-l-4 rounded-r-md p-5 space-y-3" style={{ borderLeftColor: config.color }}>
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-muted" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Activity Summary</span>
          </div>
          <p className="text-sm font-bold text-primary leading-relaxed m-0">{log.message}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Initiator Context</h4>
          <div className="modal-detail-grid">
            <DetailItem icon={Mail} label="Email Identity" value={log.email} />
            <DetailItem icon={Shield} label="Access Role" value={log.user_role || 'Super Admin'} />
            <DetailItem icon={Building2} label="Entity" value={log.organization_name || 'System Central'} />
            <DetailItem icon={Globe} label="Resource origin" value={log.ip_address === "::1" ? "Localhost (::1)" : log.ip_address} mono />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Temporal Data</h4>
          <div className="modal-detail-grid">
            <DetailItem icon={Calendar} label="Audit Date" value={date} />
            <DetailItem icon={Clock} label="Timestamp" value={time} mono />
          </div>
        </div>

        {log.temp_password && (
          <div className="bg-rose-50 border border-rose-100 rounded-md p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-800 m-0 mb-1">Temporary Credential</p>
                <code className="text-sm font-black text-rose-900">{log.temp_password}</code>
              </div>
            </div>
            <Button
              variant="ghost"
              className="h-9 px-4 text-rose-600 hover:bg-rose-100 border border-rose-200"
              onClick={() => {
                navigator.clipboard.writeText(log.temp_password);
                notify.success("Identity token copied");
              }}
            >
              <Copy size={14} className="mr-2" />
              Copy
            </Button>
          </div>
        )}
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
