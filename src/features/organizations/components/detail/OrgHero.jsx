import React from "react";
import { Building2, Power, PowerOff, Bell, Tag, CreditCard, Hash, Calendar } from "lucide-react";
import { StatusBadge, Badge } from "@components/ui";
import Button from "@components/ui/Button";
import { formatRelative } from "@utils/format";
import "../../styles/org-detail.css";

export default function OrgHero({ org, onEnable, onDisable, onNotify, onManagePlan, onManageCoupons }) {
  if (!org) return null;

  return (
    <div className="org-hero ds-card--shimmer">
      <OrgLogo logo={org.logo} name={org.name} />

      <div className="flex-1 min-w-0 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{org.name}</h1>
          <div className="flex items-center justify-center gap-2">
            <StatusBadge status={org.status} size="md" />
            <Badge variant="soft" className="org-hero-badge">
              {org.subscription_tier}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs font-semibold">
          <div className="org-hero-code-wrapper">
            <Hash size={14} className="org-hero-code-icon" />
            <span className="font-mono tracking-wider">{org.org_code}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Calendar size={14} />
            <span>Onboarded {formatRelative(org.created_at)}</span>
          </div>
        </div>
      </div>

      <OrgActions 
        status={org.status} onNotify={onNotify} onManagePlan={onManagePlan} 
        onManageCoupons={onManageCoupons} onEnable={onEnable} onDisable={onDisable} 
      />
    </div>
  );
}

function OrgLogo({ logo, name }) {
  return (
    <div className="org-hero-logo">
      {logo ? <img src={logo} alt={name} className="w-full h-full object-cover" /> : <Building2 size={40} strokeWidth={1.5} />}
    </div>
  );
}

function OrgActions({ status, onNotify, onManagePlan, onManageCoupons, onEnable, onDisable }) {
  return (
    <div className="org-hero__actions w-full md:w-80">
      <Button variant="info" icon={Bell} onClick={onNotify} fullWidth>Push</Button>
      <Button variant="success" icon={CreditCard} onClick={onManagePlan} fullWidth>Plan</Button>
      <Button variant="warning" icon={Tag} onClick={onManageCoupons} fullWidth>Coupons</Button>
      {status === "disabled" ? (
        <Button variant="success" icon={Power} onClick={onEnable} fullWidth>Enable</Button>
      ) : (
        <Button variant="danger" icon={PowerOff} onClick={onDisable} fullWidth>Disable</Button>
      )}
    </div>
  );
}
