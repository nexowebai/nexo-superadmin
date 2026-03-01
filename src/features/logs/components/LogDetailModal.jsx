import {
  Mail,
  Shield,
  Building2,
  Clock,
  Server,
  AlertCircle,
  Calendar,
  Lock,
  X,
} from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@components/ui/Modal";
import Button from "@components/ui/Button";
import { formatDateTime } from "@utils/format";
import "./LogDetailModal.css";

const levelConfig = {
  info: { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", icon: "ℹ️" },
  success: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)", icon: "✓" },
  warn: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", icon: "⚠" },
  warning: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", icon: "⚠" },
  error: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", icon: "✕" },
};

const DetailRow = ({ icon: Icon, label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div
      className={`log-detail-row ${fullWidth ? "log-detail-row--full" : ""}`}
    >
      <div className="log-detail-row__icon">
        <Icon size={16} />
      </div>
      <div className="log-detail-row__content">
        <span className="log-detail-row__label">{label}</span>
        <span className="log-detail-row__value">{value}</span>
      </div>
    </div>
  );
};

function LogDetailModal({ log, isOpen, onClose }) {
  if (!log) return null;

  const config = levelConfig[log.log_level] || levelConfig.info;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="log-modal-header">
          <div
            className="log-modal-badge"
            style={{ background: config.bg, color: config.color }}
          >
            <span className="log-modal-badge__icon">{config.icon}</span>
            <span className="log-modal-badge__text">
              {log.log_level?.toUpperCase()}
            </span>
          </div>
          <div className="log-modal-meta">
            <ModalTitle>System Log Details</ModalTitle>
            <p className="log-modal-type">
              {log.log_type || log.action || "General"}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="log-modal-section">
          <h4 className="log-modal-section__title">Message</h4>
          <div className="log-modal-message">
            <p>{log.message}</p>
          </div>
        </div>

        <div className="log-modal-section">
          <h4 className="log-modal-section__title">User Information</h4>
          <div className="log-detail-grid">
            <DetailRow icon={Mail} label="Email" value={log.email} />
            <DetailRow icon={Shield} label="Role" value={log.user_role} />
          </div>
        </div>

        {(log.organization_name || log.ip_address) && (
          <div className="log-modal-section">
            <h4 className="log-modal-section__title">System Information</h4>
            <div className="log-detail-grid">
              {log.organization_name && (
                <DetailRow
                  icon={Building2}
                  label="Organization"
                  value={log.organization_name}
                />
              )}
              {log.ip_address && (
                <DetailRow
                  icon={Server}
                  label="IP Address"
                  value={
                    log.ip_address === "::1" ? "localhost" : log.ip_address
                  }
                />
              )}
            </div>
          </div>
        )}

        <div className="log-modal-section">
          <h4 className="log-modal-section__title">Activity Details</h4>
          <div className="log-detail-grid">
            {log.status && (
              <DetailRow icon={AlertCircle} label="Status" value={log.status} />
            )}
            <DetailRow
              icon={Calendar}
              label="Timestamp"
              value={formatDateTime(log.created_at)}
            />
          </div>
        </div>

        {log.temp_password && (
          <div className="log-modal-section">
            <div className="log-modal-alert">
              <div className="log-modal-alert__header">
                <Lock size={18} />
                <h4>Temporary Password</h4>
              </div>
              <code className="log-modal-code">{log.temp_password}</code>
              <p className="log-modal-alert__note">
                This password should be changed immediately after first login
              </p>
            </div>
          </div>
        )}

        {log.description && (
          <div className="log-modal-section">
            <h4 className="log-modal-section__title">Additional Description</h4>
            <div className="log-modal-description">
              <p>{log.description}</p>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" icon={X} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default LogDetailModal;
