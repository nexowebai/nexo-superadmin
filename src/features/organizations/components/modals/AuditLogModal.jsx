import React, { memo } from "react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@components/ui";
import { History, Shield, CreditCard, UserCog, LogIn, X } from "lucide-react";
import Button from "@components/ui/Button";

/**
 * CONFIGURATION: Audit Type Visual Map
 * Centralized mapping for colors and icons linked to system tokens.
 */
const AUDIT_CONFIG = {
  security: {
    color: "var(--error)",
    softBg: "var(--error-soft)",
    icon: Shield
  },
  billing: {
    color: "var(--success)",
    softBg: "var(--success-soft)",
    icon: CreditCard
  },
  access: {
    color: "var(--primary)",
    softBg: "var(--primary-soft)",
    icon: UserCog
  },
  system: {
    color: "var(--info)",
    softBg: "var(--info-soft)",
    icon: LogIn
  },
};

/**
 * COMPONENT: AuditCard
 * Memoized list item for high-performance scrolling in dense logs.
 */
const AuditCard = memo(({ type, action, user, timestamp, detail }) => {
  const config = AUDIT_CONFIG[type] || AUDIT_CONFIG.system;
  const Icon = config.icon;

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-lg border transition-all duration-300 group"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-base)",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center border shadow-inner group-hover:scale-105 transition-transform"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-base)"
            }}
          >
            <Icon size={18} style={{ color: config.color }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>
              {action}
            </span>
            <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{timestamp}</span>
          </div>
        </div>

        <div
          className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-[0.15em] border"
          style={{
            backgroundColor: config.softBg,
            borderColor: `color-mix(in srgb, ${config.color}, transparent 70%)`,
            color: config.color
          }}
        >
          {type}
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] py-2 border-t mt-1" style={{ borderColor: "var(--border-base)" }}>
        <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <span className="font-bold uppercase tracking-tighter">Operator:</span>
          <span className="font-black" style={{ color: "var(--text-secondary)" }}>{user}</span>
        </div>
      </div>

      {detail && (
        <div
          className="p-3 rounded border text-[11px] font-medium leading-relaxed font-mono"
          style={{
            backgroundColor: "var(--bg-app)",
            borderColor: "var(--border-base)",
            color: "var(--text-secondary)"
          }}
        >
          <span style={{ color: "var(--primary)", marginRight: "var(--space-2)" }}>&gt;&gt;</span>{detail}
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
      <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-base)" }}>
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon" style={{ backgroundColor: "var(--primary-soft)", borderColor: "var(--primary)" }}>
            <History size={20} style={{ color: "var(--primary)" }} />
          </div>
          <div className="ds-modal-header__content">
            <ModalTitle style={{ color: "var(--text-primary)" }}>Audit Review History</ModalTitle>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{orgName}</p>
          </div>
        </ModalHeader>

        <ModalBody className="p-0 overflow-hidden">
          <div className="max-h-[520px] overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {mockLogs.map((log, i) => (
              <AuditCard key={i} {...log} />
            ))}

            <div className="pt-8 pb-12 flex items-center gap-4 justify-center">
              <div className="h-px w-12" style={{ backgroundColor: "var(--border-base)" }} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: "var(--text-dimmed)" }}>End of Log</span>
              <div className="h-px w-12" style={{ backgroundColor: "var(--border-base)" }} />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="modal-form-footer flex justify-center">
          <Button
            variant="outline"
            icon={X}
            onClick={onClose}
            className="px-12 font-black tracking-[0.2em] uppercase text-xs transition-all"
            style={{
              height: "3rem",
              borderColor: "var(--primary)",
              color: "var(--primary)"
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
