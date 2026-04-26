import React from "react";
import { Mail, Globe, CreditCard, Clock, Copy, Key, MapPin, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/Card";
import Button from "@components/ui/Button";
import notify from "@utils/notify";
import { formatDate } from "@utils/format";
import "../../styles/org-detail.css";

export default function OrgInfo({ org, onResetPassword }) {
  if (!org) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card className="ds-card--shimmer">
        <CardHeader className="border-b px-5 py-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest org-info-registry-title">Corporate Registry</CardTitle>
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

      {org.admin && <OrgOwnerCard admin={org.admin} onResetPassword={onResetPassword} />}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, copyable }) {
  const handleCopy = () => {
    if (value && copyable) {
      navigator.clipboard.writeText(String(value));
      notify.success("Copied to clipboard");
    }
  };

  return (
    <div onClick={copyable ? handleCopy : undefined} className={`group org-info-item ${copyable ? "org-info-item--clickable" : ""}`}>
      <div className="org-info-item-icon-box">
        <Icon size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-widest text-muted/60">{label}</span>
        <span className="text-sm font-bold truncate flex items-center gap-2 text-primary">
          {value || "—"}
          {copyable && value && <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />}
        </span>
      </div>
    </div>
  );
}

function OrgOwnerCard({ admin, onResetPassword }) {
  return (
    <Card className="ds-card--shimmer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="org-owner-avatar">
              {admin.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-sm font-black truncate text-primary">{admin.full_name}</h4>
                <span className="text-[10px] font-bold uppercase tracking-widest org-owner-badge">Owner</span>
              </div>
              <p className="text-xs font-medium opacity-60 truncate text-secondary">{admin.email}</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" icon={Key} onClick={onResetPassword}>Reset Access</Button>
        </div>
      </CardContent>
    </Card>
  );
}
