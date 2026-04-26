import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff } from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { useLayout } from "@context";
import Button from "@components/ui/Button";
import { useCreateAdminForm } from "../hooks/useCreateAdminForm";

function CreateAdminPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();
  const {
    formData,
    showPassword,
    setShowPassword,
    errors,
    isPending,
    handleChange,
    generatePassword,
    handleSubmit,
  } = useCreateAdminForm();

  useEffect(() => {
    setHeaderProps({ title: "Create Admin" });
  }, [setHeaderProps]);

  return (
    <PageContainer>
      <form onSubmit={handleSubmit} className="create-form">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="form-section">
            <div className="form-section-header">
              <Shield size={20} />
              <div>
                <h3>Admin Account Details</h3>
                <p>Enter the admin account information</p>
              </div>
            </div>
            <div className="form-grid">
              <FormInput
                label="First Name *"
                value={formData.first_name}
                onChange={(val) => handleChange("first_name", val)}
                placeholder="John"
                error={errors.first_name}
                required
              />
              <FormInput
                label="Last Name *"
                value={formData.last_name}
                onChange={(val) => handleChange("last_name", val)}
                placeholder="Doe"
                error={errors.last_name}
                required
              />
              <FormInput
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(val) => handleChange("email", val)}
                placeholder="admin@platform.com"
                error={errors.email}
                required
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={formData.phone_number}
                onChange={(val) => handleChange("phone_number", val)}
                placeholder="+1234567890"
              />
              <div className="form-field">
                <label>Password *</label>
                <div className="input-with-action">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className="form-field">
                <label>&nbsp;</label>
                <Button type="button" variant="secondary" onClick={generatePassword}>
                  Generate Password
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={() => navigate("/admins")}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create Admin
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

function FormInput({ label, type = "text", value, onChange, placeholder, error, required }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default CreateAdminPage;
