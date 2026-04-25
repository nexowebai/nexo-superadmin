import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@lib/cn";
import { Button, Input, Checkbox, SEO } from "@components/ui";
import { AuthAlert } from "../components/AuthAlert";
import { useAuth } from "@context/AuthContext";
import "./AuthPages.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data) => {
    if (loading) return;

    clearAuthError();
    login(data)
      .then((result) => {
        if (result) {
          setSuccessMessage(`Welcome back! Redirecting...`);
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 800);
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  return (
    <div className="ds-auth-form">
      <SEO
        title="Login"
        description="Sign in to your Nexo account to manage your projects and team smarter."
      />

      {/* Full Page Success Transition */}
      {(successMessage || (loading && !error)) && (
        <div
          className={cn(
            "ds-auth-transition",
            successMessage && "ds-auth-transition--success",
          )}
        >
          <div className="ds-auth-transition__content">
            <div className="ds-auth-transition__spinner" />
            <h2 className="ds-auth-transition__title">
              {successMessage
                ? "Security verified."
                : "Securing your workspace..."}
            </h2>
            <p className="ds-auth-transition__subtitle">
              {successMessage
                ? "Welcome back, Super Admin."
                : "Verifying credentials with Nexo Core."}
            </p>
          </div>
        </div>
      )}

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
          onDismiss={clearAuthError}
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
            onRightIconClick={() => setShowPassword(!showPassword)}
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
          <span style={{ color: "#1f2937", fontWeight: 600 }}>
            Contact your administrator
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
