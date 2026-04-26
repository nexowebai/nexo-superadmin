import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "./useAuthMutations";

export function useResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { execute: resetPassword, isPending: loading, error, reset: clearError } = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = useCallback((data) => {
    if (!token) return;

    resetPassword({ token, password: data.password }, {
      onSuccess: () => {
        setSuccess(true);
      }
    });
  }, [token, resetPassword]);

  const togglePassword = useCallback(() => setShowPassword(p => !p), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword(p => !p), []);

  return {
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
    clearError
  };
}
