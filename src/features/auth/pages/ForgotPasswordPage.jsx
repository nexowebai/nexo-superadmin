import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Input, SEO } from "@components/ui";
import { AuthAlert } from "../components/AuthAlert";
import { useForgotPasswordPage } from "../hooks/useForgotPasswordPage";
import "../styles/AuthPages.css";

function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    error,
    success,
    email,
    onSubmit,
    clearError,
    resetSuccess
  } = useForgotPasswordPage();

  if (success) {
    return (
      <div className="ds-auth-form">
        <div className="ds-auth-form__success">
          <div className="ds-auth-form__success-icon">
            <CheckCircle size={40} strokeWidth={2.5} />
          </div>
          <h1 className="ds-auth-form__title">Check your email</h1>
          <p className="ds-auth-form__subtitle">
            We've sent reset instructions to
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        <div className="ds-auth-form__actions">
          <Button
            variant="secondary"
            size="lg"
            onClick={resetSuccess}
            fullWidth
          >
            Try another email
          </Button>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link to="/login" className="ds-auth-form__back-link">
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-auth-form">
      <SEO
        title="Forgot Password"
        description="Recover your Nexo account password to regain access to your dashboard."
      />

      <div className="ds-auth-form__header">
        <h1 className="ds-auth-form__title">Forgot Password</h1>
        <p className="ds-auth-form__subtitle">
          Enter your email and we'll send you reset instructions.
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

      <form className="ds-auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="ds-auth-form__field">
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            icon={Mail}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            fullWidth
          />
        </div>

        <div className="ds-auth-form__actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            rightIcon={ArrowRight}
          >
            Send Reset Link
          </Button>
        </div>
      </form>

      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Link to="/login" className="ds-auth-form__back-link">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
