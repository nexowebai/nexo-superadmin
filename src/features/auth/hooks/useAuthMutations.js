import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuth } from "@context/AuthContext";
import { useMutationAction } from "@hooks/useMutationAction";

export function useLoginMutation() {
  const { login: setAuthData } = useAuth();
  
  const mutation = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (response) => {
      const loginData = response?.data || response;
      setAuthData(loginData);
    },
  });

  return mutation;
}

export function useLogoutMutation() {
  const { logout: clearAuthData } = useAuth();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuthData();
    },
    onError: () => {
      // Still clear data even if API fails
      clearAuthData();
    }
  });
}

export function useForgotPasswordMutation() {
  const mutation = useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });

  const execute = useMutationAction(mutation.mutate, {
    messages: {
      loading: "Sending reset instructions...",
      success: "Reset link sent to your email",
      error: (err) => err?.response?.data?.message || "Failed to send reset link",
    }
  });

  return { ...mutation, execute };
}

export function useResetPasswordMutation() {
  const mutation = useMutation({
    mutationFn: (data) => authService.resetPassword(data),
  });

  const execute = useMutationAction(mutation.mutate, {
    messages: {
      loading: "Resetting your password...",
      success: "Password reset successful",
      error: (err) => err?.response?.data?.message || "Failed to reset password",
    }
  });

  return { ...mutation, execute };
}
