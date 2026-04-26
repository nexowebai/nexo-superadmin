import { StatsCard, StatsGrid } from "@components/ui";
import { DollarSign, Users, Briefcase, Zap } from "lucide-react";
import React from "react";

const getBillingRange = (startDate, cycle) => {
  if (!startDate) return "—";
  const start = new Date(startDate);
  const end = new Date(startDate);

  if (cycle?.toLowerCase() === "yearly") {
    end.setFullYear(start.getFullYear() + 1);
  } else {
    end.setMonth(start.getMonth() + 1);
  }

  const options = { day: "numeric", month: "short", year: "numeric" };
  return `${start.toLocaleDateString("en-GB", options)} - ${end.toLocaleDateString("en-GB", options)}`;
};

export const OrgStatsOverview = ({ org }) => {
  if (!org) return null;

  return (
    <StatsGrid columns={4}>
      <StatsCard
        title="Monthly Revenue"
        value={`$${org.mrr || "0.00"}`}
        icon={DollarSign}
        trend={12.5}
        color="var(--success)"
        variant="nx"
      />
      <StatsCard
        title="Active Seats"
        value={org.users_count || 0}
        icon={Users}
        trend={4.2}
        color="var(--primary)"
        variant="nx"
      />
      <StatsCard
        title="Project Slots"
        value={org.projects_count || 0}
        icon={Briefcase}
        trend={-2.1}
        color="var(--info)"
        variant="nx"
      />
      <StatsCard
        title="Account Tier"
        value={org.subscription_tier || "Basic"}
        icon={Zap}
        color="var(--warning)"
        description={getBillingRange(org.created_at, org.billing_cycle)}
        variant="nx"
      />
    </StatsGrid>
  );
};

export default OrgStatsOverview;
