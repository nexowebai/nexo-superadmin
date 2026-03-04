import {
  Mail, Shield, Building2, Clock, Server, AlertCircle, Calendar, Lock, X, Terminal,
  Activity, Hash, Globe, User
} from "lucide-react";
import {
  Modal, ModalHeader, ModalTitle, ModalBody
} from "@components/ui/Modal";
import Button from "@components/ui/Button";
import notify from "@utils/notify";
import { cn } from "@lib/cn";
import "./LogDetailModal.css";

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
    <div className="log-audit-item">
      <div className="log-audit-item__label">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div className={cn("log-audit-item__value", mono && "font-mono text-xs")}>{value}</div>
    </div>
  );
};

function LogDetailModal({ log, isOpen, onClose }) {
  if (!log) return null;

  const config = levelConfig[log.log_level] || levelConfig.info;
  const SeverityIcon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="log-audit-header">
          <div className="log-audit-badge" style={{ backgroundColor: config.bg, color: config.color, border: `1px solid color-mix(in srgb, ${config.color}, transparent 80%)` }}>
            <SeverityIcon size={16} strokeWidth={3} />
            <span>{config.label?.toUpperCase()}</span>
          </div>
          <div className="log-audit-title-group">
            <ModalTitle>System Audit Trace</ModalTitle>
            <div className="log-audit-subtitle">
              <Hash size={12} />
              <span>Reference: {log.id}</span>
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="log-audit-content">
          <div className="log-audit-summary-card" style={{ borderLeftColor: config.color }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white/10 shadow-sm border border-black/5">
                <Terminal size={18} className="text-primary" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-secondary">Activity Summary</h4>
            </div>
            <p className="log-audit-message-text">{log.message}</p>
          </div>

          <div className="log-audit-main-grid">
            <div className="log-audit-card">
              <div className="log-audit-card-header">
                <User size={14} className="text-primary" />
                <span>Initiator Details</span>
              </div>
              <div className="log-audit-card-body">
                <DetailItem icon={Mail} label="Email Address" value={log.email} />
                <DetailItem icon={Shield} label="Account Role" value={log.user_role || 'Super Admin'} />
                <DetailItem icon={Building2} label="Organization" value={log.organization_name || 'System Central'} />
              </div>
            </div>

            <div className="log-audit-card">
              <div className="log-audit-card-header">
                <Globe size={14} className="text-primary" />
                <span>Network & Time</span>
              </div>
              <div className="log-audit-card-body">
                <DetailItem icon={Server} label="Source IP" value={log.ip_address === "::1" ? "127.0.0.1 (Local)" : log.ip_address} mono />
                <DetailItem icon={Calendar} label="Incident Date" value={new Date(log.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                <DetailItem icon={Clock} label="Exact Time" value={new Date(log.created_at).toLocaleTimeString([], { hour12: true })} mono />
              </div>
            </div>
          </div>

          {log.temp_password && (
            <div className="log-audit-security-notice">
              <div className="notice-icon">
                <Lock size={24} />
              </div>
              <div className="notice-content">
                <h5 className="font-bold text-lg mb-1">Temporary Credential Issued</h5>
                <div className="flex items-center gap-3 mt-3">
                  <code className="log-audit-password-box">{log.temp_password}</code>
                  <Button variant="ghost" size="sm" className="h-10 px-4" onClick={() => {
                    navigator.clipboard.writeText(log.temp_password);
                    notify.success("Copied to clipboard");
                  }}>Copy</Button>
                </div>
                <p className="text-xs opacity-60 mt-4 flex items-center gap-2">
                  <AlertCircle size={12} />
                  Sensitive data. Access is logged.
                </p>
              </div>
            </div>
          )}

          <div className="log-audit-footer-actions">
            <Button variant="secondary" onClick={onClose} className="px-10 h-[52px] min-w-[160px] font-bold">
              Dismiss Trace
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default LogDetailModal;
