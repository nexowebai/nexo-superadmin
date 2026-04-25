import {
  Building2,
  Power,
  PowerOff,
  Bell,
  Tag,
  CreditCard,
  Hash,
  Calendar,
} from "lucide-react";
import { StatusBadge, Badge } from "@components/ui";
import Button from "@components/ui/Button";
import { formatRelative } from "@utils/format";

export const EditIconSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default function OrgHero({
  org,
  onEnable,
  onDisable,
  onNotify,
  onManagePlan,
  onManageCoupons,
}) {
  if (!org) return null;

  return (
    <div
      className="flex flex-col md:flex-row gap-8 items-center p-8 ds-card--shimmer"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-base)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div
        className="w-24 h-24 shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-base)",
          borderRadius: "var(--radius-md)",
          color: "var(--primary)"
        }}
      >
        {org.logo ? (
          <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
        ) : (
          <Building2 size={40} strokeWidth={1.5} />
        )}
      </div>

      <div className="flex-1 min-w-0 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {org.name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <StatusBadge status={org.status} size="md" />
            <Badge variant="soft" style={{ borderRadius: "var(--radius-md)", fontWeight: "bold" }}>
              {org.subscription_tier}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <Hash size={14} style={{ color: "var(--primary)" }} />
            <span className="font-mono tracking-wider">{org.org_code}</span>
          </div>

          <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <Calendar size={14} />
            <span>Onboarded {formatRelative(org.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full md:w-80 shrink-0">
        <Button variant="info" icon={Bell} onClick={onNotify} fullWidth>
          Push
        </Button>
        <Button variant="success" icon={CreditCard} onClick={onManagePlan} fullWidth>
          Plan
        </Button>
        <Button variant="warning" icon={Tag} onClick={onManageCoupons} fullWidth>
          Coupons
        </Button>
        {org.status === "disabled" ? (
          <Button variant="success" icon={Power} onClick={onEnable} fullWidth>
            Enable
          </Button>
        ) : (
          <Button variant="danger" icon={PowerOff} onClick={onDisable} fullWidth>
            Disable
          </Button>
        )}
      </div>
    </div>
  );
}
