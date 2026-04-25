import { DollarSign, Calendar, Zap, AlertTriangle } from "lucide-react";
import StatCard from "@components/ui/StatCard";

export default function OrgStats({ org }) {
  if (!org) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Monthly Revenue"
        value={`$${org.mrr || "0.00"}`}
        icon={DollarSign}
        iconColor="success"
        change={12.5}
        trend="up"
      />
      <StatCard
        title="Billing Cycle"
        value={org.billing_cycle || "Monthly"}
        icon={Calendar}
        iconColor="primary"
        trend="neutral"
      />
      <StatCard
        title="Active Projects"
        value={org.projects_count || 0}
        icon={Zap}
        iconColor="info"
        change={3}
        trend="up"
      />
      <StatCard
        title="Churn Risk"
        value={org.churn_risk || "Low"}
        icon={AlertTriangle}
        iconColor={org.churn_risk === "High" ? "danger" : "warning"}
        trend="down"
      />
    </div>
  );
}
