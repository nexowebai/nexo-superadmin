import { Card, CardHeader, CardTitle, CardContent } from "@components/ui";
import { History, Trash2, ShieldCheck } from "lucide-react";
import Button from "@components/ui/Button";
import { CircularProgress, PieChart, BarChart } from "@components/charts";

const ChartCard = ({ title, children, height = "h-80", action }) => (
  <Card className={`${height} flex flex-col overflow-visible ds-card--shimmer`}>
    <CardHeader className="border-b px-5 py-3 flex flex-row items-center justify-between">
      <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </CardTitle>
      {action}
    </CardHeader>
    <CardContent className="flex-1 overflow-visible">{children}</CardContent>
  </Card>
);

export default function OrgCharts({ org, onAuditLog, onDelete }) {
  if (!org) return null;

  const barData = [
    { label: "NOV", value: 450 },
    { label: "DEC", value: 620 },
    { label: "JAN", value: 890 },
    { label: "FEB", value: 750 },
    { label: "MAR", value: 940 },
    { label: "APR", value: 1100 },
  ];

  const revenueData = [
    { label: "Base Tier", value: 60, color: "var(--primary)" },
    { label: "Growth Add-ons", value: 30, color: "var(--info)" },
    { label: "System Fees", value: 10, color: "var(--warning)" },
  ];

  return (
    <div className="flex flex-col gap-6 overflow-visible pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-visible">
        {/* Security Control */}
        <ChartCard title="Security Control">
          <div className="flex flex-col p-6 gap-4 justify-center h-full">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-green-500" />
                <span className="text-xs font-black tracking-wider uppercase text-slate-600 dark:text-slate-300">
                  System Secure
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="secondary"
                icon={History}
                onClick={onAuditLog}
                fullWidth
              >
                Review Audit History
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={onDelete}
                fullWidth
              >
                Terminate Platform Access
              </Button>
            </div>
          </div>
        </ChartCard>

        {/* Global Storage Intelligence */}
        <ChartCard title="Storage Intelligence">
          <CircularProgress
            percent={45}
            color="var(--info)"
            label="Global Capacity"
          />
        </ChartCard>

        {/* Revenue Segmentation */}
        <ChartCard title="Revenue Segmentation">
          <PieChart data={revenueData} />
        </ChartCard>
      </div>

      {/* Full-Width Master Trend */}
      <ChartCard title="Utilization Trend" height="h-auto">
        <div className="p-8 overflow-visible">
          <BarChart data={barData} />
        </div>
      </ChartCard>
    </div>
  );
}
