import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Building2, User, CreditCard, Save, Upload, X, Hash } from "lucide-react";
import { cn } from "@lib/cn";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, Select, DatePicker } from "@components/ui";
import { useCreateOrganizationPage } from "../hooks/useCreateOrganizationPage";
import { TIER_OPTIONS, PLAN_OPTIONS } from "../constants/organizationData";
import FormSkeleton from "../components/FormSkeleton";
import "../styles/organizations.css";

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setHeaderProps } = useLayout();
  const {
    formData,
    isLoading,
    creating,
    updating,
    isEdit,
    handleChange,
    handleDropdownChange,
    handleSubmit,
  } = useCreateOrganizationPage(id);

  useEffect(() => {
    setHeaderProps({
      title: isEdit ? "Edit Organization" : "Add Organization",
    });

    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, isEdit]);

  if (isLoading)
    return (
      <PageContainer>
        <FormSkeleton />
      </PageContainer>
    );

  return (
    <PageContainer>
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-header">
            <Building2 size={20} />
            <h3>Organization Details</h3>
          </div>
          <div className="form-grid">
            <Field
              label="Organization Name *"
              name="name"
              icon={Building2}
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Acme Foundation"
            />
            <Field
              label="Organization Code *"
              name="org_code"
              icon={Hash}
              value={formData.org_code}
              onChange={handleChange}
              required
              placeholder="ACM001"
              disabled={isEdit}
            />
            <Field
              label="Contact Email *"
              name="email"
              icon={User}
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@acme.org"
            />
            <div className="form-field">
              <label>Organization Logo</label>
              <div className="logo-upload-container">
                {formData.logo ? (
                  <div className="logo-preview-wrapper">
                    <img src={formData.logo} alt="Logo Preview" className="logo-preview-img" />
                    <button
                      type="button"
                      className="logo-remove-btn"
                      onClick={() => handleDropdownChange("logo", "")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="logo-upload-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleDropdownChange("logo", reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                        <Upload size={20} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                        Click to upload logo
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <CreditCard size={20} />
            <h3>Subscription Plan</h3>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Subscription Tier</label>
              <Select
                options={TIER_OPTIONS}
                value={formData.subscription_tier}
                onChange={(v) => handleDropdownChange("subscription_tier", v)}
                fullWidth
              />
            </div>
            <div className="form-field">
              <label>Plan Type</label>
              <Select
                options={PLAN_OPTIONS}
                value={formData.plan_type}
                onChange={(v) => handleDropdownChange("plan_type", v)}
                fullWidth
              />
            </div>
            <div className="form-field">
              <label>Plan Start Date</label>
              <DatePicker
                value={formData.plan_starts_at}
                onChange={(v) => handleDropdownChange("plan_starts_at", v)}
                fullWidth
                placement="top"
              />
            </div>
            <div className="form-field">
              <label>Plan Expiry Date</label>
              <DatePicker
                value={formData.plan_expires_at}
                onChange={(v) => handleDropdownChange("plan_expires_at", v)}
                fullWidth
                placement="top"
              />
            </div>
            <Field
              label="Max Users"
              type="number"
              name="max_users"
              icon={User}
              value={formData.max_users}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        {!isEdit && (
          <div className="form-section">
            <div className="form-section-header">
              <User size={20} />
              <h3>Admin Account</h3>
            </div>
            <div className="form-grid">
              <Field
                label="Admin Email *"
                type="email"
                name="admin_email"
                icon={User}
                value={formData.admin_email}
                onChange={handleChange}
                required
                placeholder="admin@acme.org"
              />
              <Field
                label="Temporary Password *"
                name="temp_password"
                icon={Hash}
                value={formData.temp_password}
                onChange={handleChange}
                required
                placeholder="SecureTemp123!"
              />
              <Field
                label="First Name *"
                name="admin_first_name"
                icon={User}
                value={formData.admin_first_name}
                onChange={handleChange}
                required
                placeholder="John"
              />
              <Field
                label="Last Name *"
                name="admin_last_name"
                icon={User}
                value={formData.admin_last_name}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <Button
            variant="secondary"
            type="button"
            className="font-semibold"
            onClick={() => navigate("/organizations")}
          >
            Cancel
          </Button>
          <Button type="submit" icon={Save} loading={creating || updating}>
            {isEdit ? "Update Organization" : "Add Organization"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

function Field({ label, icon: Icon, error, ...props }) {
  return (
    <div className="form-field">
      <label className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon size={14} className="text-muted" />}
        {label}
      </label>
      <div className="relative">
        <input
          className={cn(
            "w-full transition-all",
            error && "border-error focus:ring-error-soft"
          )}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-bold text-error mt-1 uppercase tracking-wider block">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
