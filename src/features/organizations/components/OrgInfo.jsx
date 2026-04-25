import {
  Mail,
  Globe,
  CreditCard,
  Clock,
  Copy,
  Key,
  MapPin,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/Card";
import Button from "@components/ui/Button";
import notify from "@utils/notify";
import { formatDate } from "@utils/format";

const InfoItem = ({ icon: Icon, label, value, copyable }) => {
  const handleCopy = () => {
    if (value && copyable) {
      navigator.clipboard.writeText(String(value));
      notify.success("Copied to clipboard");
    }
  };

  return (
    <div
      onClick={copyable ? handleCopy : undefined}
      className={`group flex items-center gap-4 px-5 py-3 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
        copyable ? "cursor-pointer" : ""
      }`}
      style={{ borderBottom: "1px solid var(--border-base)" }}
    >
      <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800" style={{ color: "var(--primary)" }}>
        <Icon size={16} strokeWidth={2} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <span className="text-sm font-medium truncate flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          {value || "—"}
          {copyable && value && (
            <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--primary)" }} />
          )}
        </span>
      </div>
    </div>
  );
};

export default function OrgInfo({ org, onResetPassword }) {
  if (!org) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card className="ds-card--shimmer">
        <CardHeader className="border-b px-5 py-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Corporate Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <InfoItem icon={Mail} label="Contact Email" value={org.email} copyable />
            <InfoItem icon={Globe} label="Portal Website" value={org.website || "https://nexo-partner.com"} />
            <InfoItem icon={FileText} label="Registration ID" value={org.tax_id} copyable />
            <InfoItem icon={MapPin} label="Geographic Region" value={org.region} />
            <InfoItem icon={CreditCard} label="Billing Model" value={org.billing_cycle} />
            <InfoItem icon={Clock} label="Account Active Since" value={formatDate(org.created_at)} />
          </div>
        </CardContent>
      </Card>

      {org.admin && (
        <Card className="ds-card--shimmer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div 
                  className="w-12 h-12 flex items-center justify-center text-lg font-black text-white shrink-0"
                  style={{ background: "var(--primary)", borderRadius: "var(--radius-md)" }}
                >
                  {org.admin.full_name?.charAt(0) || "A"}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-black truncate" style={{ color: "var(--text-primary)" }}>
                      {org.admin.full_name}
                    </h4>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">Owner</span>
                  </div>
                  <p className="text-xs font-medium opacity-60 truncate" style={{ color: "var(--text-secondary)" }}>{org.admin.email}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" icon={Key} onClick={onResetPassword}>
                Reset Access
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
