import { Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/Card";
import "../../styles/org-detail.css";

const UsageBar = ({ label, current, max, color }) => {
  const percent = Math.min((current / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className="org-sidebar-usage-label">{label}</span>
        <span className="org-sidebar-usage-value">{current} / {max}</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden org-sidebar-progress-track">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ "--percent": `${percent}%`, backgroundColor: color }} /* allowed-inline */
        />
      </div>
    </div>
  );
};

export default function OrgSidebar({ org }) {
  if (!org) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card className="ds-card--shimmer">
        <CardHeader className="border-b px-5 py-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Resource Governance</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          <UsageBar label="Authorized Seats" current={org.users_count} max={org.max_users} color="var(--primary)" />
          <UsageBar label="Active Project Slots" current={org.projects_count} max={org.max_projects} color="var(--info)" />

          <div className="pt-2">
            <div className="p-4 rounded border org-sidebar-renewal-card">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap size={12} className="org-sidebar-renewal-label" />
                <span className="text-xs font-bold uppercase tracking-wider org-sidebar-renewal-label">Renewal Intelligence</span>
              </div>
              <p className="text-sm font-black org-sidebar-renewal-date">May 15, 2024</p>
              <p className="text-xs font-medium opacity-70 org-sidebar-renewal-mrr">Expected: ${org.mrr} MRR</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
