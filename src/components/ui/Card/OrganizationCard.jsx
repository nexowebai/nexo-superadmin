import React from "react";
import {
  Building2,
  ArrowUpRight,
  Zap,
  Crown,
  Target,
  Hash,
} from "lucide-react";
import { Button, Card } from "@components/ui";

const PLAN_CONFIG = {
  basic: { icon: Zap, color: "var(--info)", bg: "var(--info-soft)" },
  pro: { icon: Target, color: "var(--primary)", bg: "var(--primary-soft)" },
  enterprise: {
    icon: Crown,
    color: "var(--warning)",
    bg: "var(--warning-soft)",
  },
  default: {
    icon: Building2,
    color: "var(--text-muted)",
    bg: "var(--bg-elevated)",
  },
};

export const OrganizationCard = ({ organization, onClick }) => {
  const org = organization;
  const plan = org.plan?.toLowerCase() || "default";
  const planConfig = PLAN_CONFIG[plan] || PLAN_CONFIG.default;
  const PlanIcon = planConfig.icon;

  return (
    <Card
      onClick={onClick}
      padding="none"
      className="relative group flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--primary)] hover:shadow-none transition-all overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Status Badge - Absolute Top Right */}
      <div
        className={`absolute top-0 right-0 px-5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest border-l border-b ${
          org.status === "active"
            ? "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-soft)]"
            : "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning-soft)]"
        }`}
      >
        {org.status}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-5 mb-6 mt-3">
          {/* Organization Avatar */}
          <div className="w-16 h-16 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary-soft)] flex items-center justify-center shrink-0 shadow-inner transition-all duration-300">
            {org.logo ? (
              <img
                src={org.logo}
                alt={org.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Building2
                size={32}
                strokeWidth={1.5}
                className="text-[var(--primary)]"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-black text-[var(--text-primary)] truncate group-hover:text-[var(--primary)] transition-colors leading-none mb-2">
              {org.name}
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg border"
                /* allowed-inline */
                style={{
                  borderColor: planConfig.color,
                  backgroundColor: planConfig.bg,
                  color: planConfig.color,
                }}
              >
                <PlanIcon size={12} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {org.plan}
                </span>
              </div>

              {/* ID Badge replacing Member Count */}
              <div className="flex items-center gap-1.5 text-[11px] font-black text-[var(--text-muted)] opacity-70 bg-[var(--bg-subtle)] px-2 py-1 rounded-md border border-[var(--border-base)]">
                <Hash size={12} strokeWidth={3} />
                <span>NX-{String(org.id).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button
            variant="action"
            fullWidth
            size="md"
            rightIcon={ArrowUpRight}
            className="font-black"
          >
            Manage Organization
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OrganizationCard;
