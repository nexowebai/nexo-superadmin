import React from "react";
import { Building2, User, CreditCard, Hash, Upload, X } from "lucide-react";
import { Select, DatePicker } from "@components/ui";
import { TIER_OPTIONS, PLAN_OPTIONS } from "../../constants/organizationData";
import "../../styles/org-form.css";
import { FormField } from "./FormField";

export function OrgDetailsSection({ formData, handleDropdownChange, handleChange, isEdit }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <Building2 size={20} />
        <h3>Organization Details</h3>
      </div>
      <div className="form-grid">
        <FormField label="Organization Name *" name="name" icon={Building2} value={formData.name} onChange={handleChange} required placeholder="Acme Foundation" />
        <FormField label="Organization Code *" name="org_code" icon={Hash} value={formData.org_code} onChange={handleChange} required placeholder="ACM001" disabled={isEdit} />
        <FormField label="Contact Email *" name="email" icon={User} value={formData.email} onChange={handleChange} required placeholder="contact@acme.org" />
        <div className="form-field">
          <label>Organization Logo</label>
          <LogoUpload logo={formData.logo} onChange={(val) => handleDropdownChange("logo", val)} />
        </div>
      </div>
    </div>
  );
}

export function SubscriptionSection({ formData, handleDropdownChange, handleChange }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <CreditCard size={20} />
        <h3>Subscription Plan</h3>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label>Subscription Tier</label>
          <Select options={TIER_OPTIONS} value={formData.subscription_tier} onChange={(v) => handleDropdownChange("subscription_tier", v)} fullWidth />
        </div>
        <div className="form-field">
          <label>Plan Type</label>
          <Select options={PLAN_OPTIONS} value={formData.plan_type} onChange={(v) => handleDropdownChange("plan_type", v)} fullWidth />
        </div>
        <div className="form-field">
          <label>Plan Start Date</label>
          <DatePicker value={formData.plan_starts_at} onChange={(v) => handleDropdownChange("plan_starts_at", v)} fullWidth placement="top" />
        </div>
        <div className="form-field">
          <label>Plan Expiry Date</label>
          <DatePicker value={formData.plan_expires_at} onChange={(v) => handleDropdownChange("plan_expires_at", v)} fullWidth placement="top" />
        </div>
        <FormField label="Max Users" type="number" name="max_users" icon={User} value={formData.max_users} onChange={handleChange} min="1" />
      </div>
    </div>
  );
}

export function AdminAccountSection({ formData, handleChange }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <User size={20} />
        <h3>Admin Account</h3>
      </div>
      <div className="form-grid">
        <FormField label="Admin Email *" type="email" name="admin_email" icon={User} value={formData.admin_email} onChange={handleChange} required placeholder="admin@acme.org" />
        <FormField label="Temporary Password *" name="temp_password" icon={Hash} value={formData.temp_password} onChange={handleChange} required placeholder="SecureTemp123!" />
        <FormField label="First Name *" name="admin_first_name" icon={User} value={formData.admin_first_name} onChange={handleChange} required placeholder="John" />
        <FormField label="Last Name *" name="admin_last_name" icon={User} value={formData.admin_last_name} onChange={handleChange} required placeholder="Doe" />
      </div>
    </div>
  );
}

function LogoUpload({ logo, onChange }) {
  return (
    <div className="logo-upload-container">
      {logo ? (
        <div className="logo-preview-wrapper">
          <img src={logo} alt="Logo Preview" className="logo-preview-img" />
          <button type="button" className="logo-remove-btn" onClick={() => onChange("")}><X size={14} /></button>
        </div>
      ) : (
        <label className="logo-upload-placeholder">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onChange(reader.result);
              reader.readAsDataURL(file);
            }
          }} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center"><Upload size={20} /></div>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Click to upload logo</span>
          </div>
        </label>
      )}
    </div>
  );
}
