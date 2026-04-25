import { Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/Card";

const UsageBar = ({ label, current, max, color }) => {
  const percent = Math.min((current / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        <span style={{ color: "var(--text-primary)" }}>
          {current} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${percent}%`, backgroundColor: color }}
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
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Resource Governance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          <UsageBar
            label="Authorized Seats"
            current={org.users_count}
            max={org.max_users}
            color="var(--primary)"
          />
          <UsageBar
            label="Active Project Slots"
            current={org.projects_count}
            max={org.max_projects}
            color="var(--info)"
          />

          <div className="pt-2">
            <div className="p-4 rounded bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap size={12} className="text-blue-500" />
                <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  Renewal Intelligence
                </span>
              </div>
              <p
                className="text-sm font-black"
                style={{ color: "var(--text-primary)" }}
              >
                May 15, 2024
              </p>
              <p
                className="text-xs font-medium opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                Expected: ${org.mrr} MRR
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
