import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button, Input, SEO } from "@components/ui";
import { AuthAlert } from "../components/AuthAlert";
import { AuthSuccessState } from "../components/AuthSuccessState";
import { useResetPasswordPage } from "../hooks/useResetPasswordPage";
import "../styles/AuthPages.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const {
    token,
    register,
    handleSubmit,
    errors,
    loading,
    error,
    success,
    showPassword,
    showConfirmPassword,
    password,
    onSubmit,
    togglePassword,
    toggleConfirmPassword,
    clearError,
  } = useResetPasswordPage();

  if (!token) {
    return (
      <div className="ds-auth-form">
        <AuthAlert type="error" message="This reset link is invalid or has expired." />
        <div className="ds-auth-form__center-spacer" style={{ marginTop: "24px" }}> {/* allowed-inline override */}
          <Link to="/forgot-password" className="ds-auth-form__back-link">
            <ArrowLeft size={16} /> Request new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <AuthSuccessState
        title="Password reset"
        subtitle="Your password has been updated successfully."
        actionLabel="Go to Login"
        onAction={() => navigate("/login")}
      />
    );
  }

  return (
    <div className="ds-auth-form">
      <SEO title="Reset Password" description="Create a new secure password for your Nexo account." />

      <div className="ds-auth-form__header">
        <h1 className="ds-auth-form__title">New Password</h1>
        <p className="ds-auth-form__subtitle">Create a strong, unique password for your account.</p>
      </div>

      {error && <AuthAlert type="error" message={error} onDismiss={clearError} className="mb-6" />}

      <form className="ds-auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="ds-auth-form__field">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={togglePassword}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
              pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/, message: "Require one uppercase and one number" },
            })}
            fullWidth
          />
        </div>

        <div className="ds-auth-form__field">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            icon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconClick={toggleConfirmPassword}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            fullWidth
          />
        </div>

        <div className="ds-auth-form__actions">
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} rightIcon={ArrowRight}>
            Reset Password
          </Button>
        </div>
      </form>

      <div className="ds-auth-form__center-spacer">
        <Link to="/login" className="ds-auth-form__back-link">
          <ArrowLeft size={16} /> Back to login
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
