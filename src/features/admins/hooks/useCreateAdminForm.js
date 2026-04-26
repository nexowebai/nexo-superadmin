import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAdmin } from "./useAdmins";
import notify from "@utils/notify";

const initialFormData = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone_number: "",
};

export function useCreateAdminForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { mutate: createAdmin, isPending } = useCreateAdmin();

  const handleChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  const generatePassword = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange("password", password);
  }, [handleChange]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validate()) return;

      notify.promise(
        new Promise((resolve, reject) => {
          createAdmin(formData, {
            onSuccess: () => {
              navigate("/admins");
              resolve();
            },
            onError: reject,
          });
        }),
        {
          loading: "Creating admin...",
          success: "Admin created successfully",
          error: (err) => err?.message || "Failed to create admin",
        },
      );
    },
    [formData, validate, createAdmin, navigate],
  );

  return {
    formData,
    showPassword,
    setShowPassword,
    errors,
    isPending,
    handleChange,
    generatePassword,
    handleSubmit,
  };
}
