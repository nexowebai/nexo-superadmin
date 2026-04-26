import React from "react";
import { User, Mail, Phone, Camera, Shield, Lock, Save } from "lucide-react";
import Button from "@components/ui/Button";

export function ProfileHero({ avatar_url, full_name, email }) {
  return (
    <div className="profile-hero">
      <div className="profile-hero__content">
        <div className="profile-hero__avatar-wrapper">
          <div className="profile-hero__avatar">
            {avatar_url ? <img src={avatar_url} alt={full_name} /> : <span>{full_name?.[0]?.toUpperCase() || "U"}</span>}
            <button className="profile-hero__avatar-edit" title="Change Avatar"><Camera size={16} /></button>
          </div>
        </div>
        <div className="profile-hero__info">
          <h1>{full_name || "System Administrator"}</h1>
          <p>Super Admin • {email}</p>
        </div>
      </div>
    </div>
  );
}

export function PersonalInfoCard({ formData, setFormData, onSubmit, loading }) {
  return (
    <div className="profile-card">
      <div className="profile-card__header"><User size={20} className="text-brand-500" /><h3>Personal Information</h3></div>
      <form onSubmit={onSubmit}>
        <div className="profile-form-grid">
          <ProfileField label="Full Name" icon={User} value={formData.full_name} onChange={(v) => setFormData({ ...formData, full_name: v })} placeholder="John Doe" required />
          <ProfileField label="Email Address" icon={Mail} value={formData.email} disabled hint="Email cannot be changed directly" />
          <ProfileField label="Phone Number" icon={Phone} value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="profile-card__footer"><Button type="submit" icon={Save} loading={loading}>Save Profile</Button></div>
      </form>
    </div>
  );
}

export function SecuritySettingsCard({ passwordData, setPasswordData, onSubmit, loading }) {
  const update = (key, val) => setPasswordData({ ...passwordData, [key]: val });
  return (
    <div className="profile-card">
      <div className="profile-card__header"><Shield size={20} className="text-amber-500" /><h3>Security Settings</h3></div>
      <form onSubmit={onSubmit}>
        <div className="profile-form-grid">
          <ProfileField label="Current Password" type="password" icon={Lock} value={passwordData.currentPassword} onChange={(v) => update("currentPassword", v)} placeholder="••••••••" required />
          <ProfileField label="New Password" type="password" icon={Lock} value={passwordData.newPassword} onChange={(v) => update("newPassword", v)} placeholder="••••••••" required />
          <ProfileField label="Confirm New Password" type="password" icon={Lock} value={passwordData.confirmPassword} onChange={(v) => update("confirmPassword", v)} placeholder="••••••••" required />
        </div>
        <div className="profile-card__footer"><Button variant="secondary" type="submit" icon={Shield} loading={loading}>Change Password</Button></div>
      </form>
    </div>
  );
}

function ProfileField({ label, icon: Icon, value, onChange, disabled, hint, ...props }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <div className={`input-wrapper ${disabled ? "disabled" : ""}`}>
        <Icon size={16} />
        <input value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} disabled={disabled} {...props} />
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
