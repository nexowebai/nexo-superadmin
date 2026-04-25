import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Building2, User, CreditCard, Save } from "lucide-react";
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
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Acme Foundation"
            />
            <Field
              label="Organization Code *"
              name="org_code"
              value={formData.org_code}
              onChange={handleChange}
              required
              placeholder="ACM001"
              disabled={isEdit}
            />
            <Field
              label="Contact Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@acme.org"
            />
            <Field
              label="Logo URL"
              name="logo"
              type="url"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://..."
            />
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
              <label>Expires At</label>
              <DatePicker
                value={formData.plan_expires_at}
                onChange={(v) => handleDropdownChange("plan_expires_at", v)}
                fullWidth
              />
            </div>
            <Field
              label="Max Users"
              type="number"
              name="max_users"
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
                value={formData.admin_email}
                onChange={handleChange}
                required
                placeholder="admin@acme.org"
              />
              <Field
                label="Temporary Password *"
                name="temp_password"
                value={formData.temp_password}
                onChange={handleChange}
                required
                placeholder="SecureTemp123!"
              />
              <Field
                label="First Name *"
                name="admin_first_name"
                value={formData.admin_first_name}
                onChange={handleChange}
                required
                placeholder="John"
              />
              <Field
                label="Last Name *"
                name="admin_last_name"
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
            variant="ghost"
            type="button"
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

function Field({ label, ...props }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}
