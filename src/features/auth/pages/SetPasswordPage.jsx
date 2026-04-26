import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button, Input, SEO } from "@components/ui";
import { AuthAlert } from "../components/AuthAlert";
import { AuthSuccessState } from "../components/AuthSuccessState";
import { PasswordRequirements, PasswordStrengthBar } from "../components/PasswordRequirements";
import { useSetPasswordPage } from "../hooks/useSetPasswordPage";
import "../styles/AuthPages.css";

function SetPasswordPage() {
  const navigate = useNavigate();
  const {
    token,
    email,
    loading,
    error,
    success,
    showPassword,
    showConfirmPassword,
    password,
    errors,
    strength,
    register,
    handleSubmit,
    onSubmit,
    clearError,
    togglePassword,
    toggleConfirmPassword,
  } = useSetPasswordPage();

  if (!token) {
    return (
      <div className="ds-auth-form">
        <AuthAlert type="error" message="This setup link is invalid. Contact your administrator." />
      </div>
    );
  }

  if (success) {
    return (
      <AuthSuccessState
        title="Account Ready"
        subtitle="Your account has been successfully set up. Please sign in to continue."
        actionLabel="Go to Login"
        onAction={() => navigate("/login")}
      />
    );
  }

  return (
    <div className="ds-auth-form">
      <SEO title="Account Setup" description="Complete your Nexo account setup by setting your password." />

      <div className="ds-auth-form__header">
        <h1 className="ds-auth-form__title">Set Password</h1>
        <p className="ds-auth-form__subtitle">
          {email ? <>Create a password for <strong>{email}</strong></> : "Create a secure password to access your account"}
        </p>
      </div>

      {error && <AuthAlert type="error" message={error} onDismiss={clearError} className="mb-6" />}

      <form className="ds-auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="ds-auth-form__field">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={togglePassword}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
              validate: {
                hasUpperCase: (v) => /[A-Z]/.test(v) || "One uppercase letter",
                hasLowerCase: (v) => /[a-z]/.test(v) || "One lowercase letter",
                hasNumber: (v) => /[0-9]/.test(v) || "One number",
                hasSpecial: (v) => /[^A-Za-z0-9]/.test(v) || "One special character",
              },
            })}
            fullWidth
          />
          <PasswordStrengthBar strength={strength} />
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

        <PasswordRequirements password={password} />

        <div className="ds-auth-form__actions">
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} rightIcon={ArrowRight}>
            Setup Account
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SetPasswordPage;
