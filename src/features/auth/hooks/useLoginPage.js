import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "./useAuthMutations";

export function useLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const { mutate: loginMutation, isPending: loading, error, reset: clearError } = useLoginMutation();

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

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback((data) => {
    if (loading) return;

    loginMutation(data, {
      onSuccess: () => {
        setSuccessMessage("Login successful, redirecting...");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 800);
      }
    });
  }, [loading, loginMutation, navigate]);

  return {
    register,
    handleSubmit,
    errors,
    loading,
    error: error?.response?.data?.message || error?.message,
    successMessage,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    clearError
  };
}
