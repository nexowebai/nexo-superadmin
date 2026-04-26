import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "./useAuthMutations";

export function useForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  
  const { execute: forgotPassword, isPending: loading, error, reset: clearError } = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback((data) => {
    forgotPassword(data.email, {
      onSuccess: () => {
        setEmail(data.email);
        setSuccess(true);
      }
    });
  }, [forgotPassword]);

  const resetSuccess = useCallback(() => setSuccess(false), []);

  return {
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
  };
}
