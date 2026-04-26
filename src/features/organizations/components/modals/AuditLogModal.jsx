import React, { memo } from "react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@components/ui";
import { History, Shield, CreditCard, UserCog, LogIn, X } from "lucide-react";
import Button from "@components/ui/Button";
import "../../styles/modals.css";

const AUDIT_CONFIG = {
  security: { color: "var(--error)", softBg: "var(--error-soft)", icon: Shield },
  billing: { color: "var(--success)", softBg: "var(--success-soft)", icon: CreditCard },
  access: { color: "var(--primary)", softBg: "var(--primary-soft)", icon: UserCog },
  system: { color: "var(--info)", softBg: "var(--info-soft)", icon: LogIn },
};

const AuditCard = memo(({ type, action, user, timestamp, detail }) => {
  const config = AUDIT_CONFIG[type] || AUDIT_CONFIG.system;
  const Icon = config.icon;

  return (
    <div className="audit-card" style={{ "--audit-color": config.color, "--audit-soft": config.softBg }} /* allowed-inline */>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="audit-card__icon-wrapper">
            <Icon size={18} />
          </div>
          <div className="flex flex-col">
            <span className="audit-card__action">{action}</span>
            <span className="audit-card__timestamp">{timestamp}</span>
          </div>
        </div>

        <div className="audit-card__type-badge">
          {type}
        </div>
      </div>

      <div className="audit-card__operator">
        <div className="flex items-center gap-1.5">
          <span className="font-bold uppercase tracking-tighter text-[10px]">Operator:</span>
          <span className="audit-card__operator-name">{user}</span>
        </div>
      </div>

      {detail && (
        <div className="audit-card__detail">
          <span className="audit-card__detail-arrow">&gt;&gt;</span>
          {detail}
        </div>
      )}
    </div>
  );
});

export default function AuditLogModal({ isOpen, onClose, orgName }) {
  const mockLogs = [
    { type: "security", action: "MFA Reset", user: "Admin_Root", timestamp: "2h ago", detail: "MFA bypass requested and verified by Super Admin." },
    { type: "billing", action: "Plan Upgrade", user: "Billing_Bot", timestamp: "5h ago", detail: "System automatically transitioned to Enterprise Tier." },
    { type: "access", action: "User Invited", user: "John_Doe", timestamp: "1d ago", detail: "Invited 'marketing-lead@nexo.com' with Editor permissions." },
    { type: "system", action: "Login Success", user: "Jane_Smith", timestamp: "2d ago", detail: "IP: 192.168.1.45 (Bangalore, IN)" },
    { type: "security", action: "Password Changed", user: "Jane_Smith", timestamp: "3d ago", detail: "Routine security rotation." },
    { type: "billing", action: "Coupon Applied", user: "Admin_Root", timestamp: "1w ago", detail: "Applied 'LAUNCH50' (50% Lifetime discount)." },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="org-modal-wrapper">
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--primary">
            <History size={20} />
          </div>
          <div className="ds-modal-header__content">
            <ModalTitle className="text-[var(--text-primary)]">Audit Review History</ModalTitle>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{orgName}</p>
          </div>
        </ModalHeader>

        <ModalBody className="p-0 overflow-hidden">
          <div className="audit-log-container scrollbar-thin">
            {mockLogs.map((log, i) => <AuditCard key={i} {...log} />)}
            
            <div className="audit-log-footer-divider">
              <div className="audit-log-divider-line" />
              <span className="audit-log-end-label">End of Log</span>
              <div className="audit-log-divider-line" />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="modal-form-footer">
          <Button 
            variant="secondary" icon={X} onClick={onClose} 
            className="px-10 h-11 text-xs"
          >
            Close Audit Log
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
