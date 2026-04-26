import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Input, Checkbox, SEO } from "@components/ui";
import { AuthAlert } from "../components/AuthAlert";
import { useLoginPage } from "../hooks/useLoginPage";
import "../styles/AuthPages.css";

function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    error,
    successMessage,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    clearError
  } = useLoginPage();

  return (
    <div className="ds-auth-form">
      <SEO
        title="Login"
        description="Sign in to your Nexo account to manage your projects and team smarter."
      />

      <div className="ds-auth-form__header">
        <h1 className="ds-auth-form__title">Welcome Back</h1>
        <p className="ds-auth-form__subtitle">
          Enter your credentials to access your dashboard
        </p>
      </div>

      {error && (
        <AuthAlert
          type="error"
          message={error}
          onDismiss={clearError}
          className="mb-6"
        />
      )}

      {successMessage && (
        <AuthAlert
          type="success"
          message={successMessage}
          className="mb-6"
        />
      )}

      <form className="ds-auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="ds-auth-form__field">
          <Input
            label="Email address"
            placeholder="name@company.com"
            icon={Mail}
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email",
              },
            })}
            type="email"
            fullWidth
          />
        </div>

        <div className="ds-auth-form__field">
          <Input
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            fullWidth
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={togglePasswordVisibility}
          />
        </div>

        <div className="ds-auth-form__row">
          <Checkbox label="Remember Me" {...register("rememberMe")} />
          <Link
            to="/forgot-password"
            title="Recover your password"
            className="ds-auth-form__link"
          >
            Forgot password?
          </Link>
        </div>

        <div className="ds-auth-form__actions">
          <Button
            type="submit"
            variant="primary"
            size="xl"
            fullWidth
            loading={loading}
            rightIcon={ArrowRight}
          >
            Sign In
          </Button>
        </div>
      </form>

      <div className="ds-auth-form__footer">
        <p className="ds-auth-form__footer-text">
          Don't have an account?{" "}
          <span className="ds-auth-form__contact-admin">
            Contact your administrator
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
