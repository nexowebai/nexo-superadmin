import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../services/authService";

export function useSetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 25, label: "Weak", color: "#ef4444" };
    if (score <= 4) return { score: 50, label: "Fair", color: "#f59e0b" };
    if (score <= 5) return { score: 75, label: "Good", color: "#10b981" };
    return { score: 100, label: "Strong", color: "#059669" };
  };

  const strength = getStrength(password);

  const onSubmit = useCallback((data) => {
    if (loading) return;
    if (!token) {
      setError("Invalid setup link.");
      return;
    }

    setLoading(true);
    setError("");

    authService
      .resetPassword({ token, password: data.password })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setError(err.message || "Failed to set password.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading, token]);

  const clearError = useCallback(() => setError(""), []);
  const togglePassword = useCallback(() => setShowPassword(p => !p), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword(p => !p), []);

  return {
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
  };
}
