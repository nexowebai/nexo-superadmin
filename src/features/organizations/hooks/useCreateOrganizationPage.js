import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useOrganization,
  useCreateOrganization,
  useUpdateOrganization,
} from "./useOrganizations";
import notify from "@utils/notify";

export function useCreateOrganizationPage(id) {
  const navigate = useNavigate();
  const isEdit = !!id;
  const initialDataRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    org_code: "",
    email: "",
    logo: "",
    subscription_tier: "professional",
    plan_type: "yearly",
    max_users: 50,
    max_projects: 25,
    plan_expires_at: "",
    admin_email: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_phone: "",
    temp_password: "",
  });

  const { data: orgData, isLoading } = useOrganization(id);
  const { mutateAsync: createOrg, isPending: creating } =
    useCreateOrganization();
  const { mutateAsync: updateOrg, isPending: updating } =
    useUpdateOrganization();

  useEffect(() => {
    if (isEdit && orgData) {
      const initialValues = {
        name: orgData.name || "",
        org_code: orgData.org_code || "",
        email: orgData.email || "",
        logo: orgData.logo || "",
        subscription_tier: orgData.subscription_tier || "professional",
        plan_type: orgData.plan_type || "yearly",
        max_users: orgData.max_users || 50,
        max_projects: orgData.max_projects || 25,
        plan_expires_at: orgData.plan_expires_at
          ? orgData.plan_expires_at.split("T")[0]
          : "",
      };
      initialDataRef.current = initialValues;
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [isEdit, orgData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDropdownChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let payload;
    if (isEdit) {
      const changedFields = {};
      const initial = initialDataRef.current || {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== initial[key]) {
          changedFields[key] =
            key === "max_users" || key === "max_projects"
              ? parseInt(formData[key])
              : formData[key];
        }
      });
      payload = changedFields;
    } else {
      payload = {
        ...formData,
        max_users: parseInt(formData.max_users),
        max_projects: parseInt(formData.max_projects),
        plan_expires_at: formData.plan_expires_at
          ? new Date(formData.plan_expires_at).toISOString()
          : undefined,
      };
    }

    const promise = isEdit
      ? updateOrg({ id, data: payload })
      : createOrg(payload);

    notify.promise(
      promise.then(() => {
        navigate(isEdit ? `/organizations/${id}` : "/organizations");
      }),
      {
        loading: isEdit
          ? "Updating organization..."
          : "Creating organization...",
        success: isEdit
          ? "Organization updated successfully!"
          : "Organization created successfully!",
        error: (err) => err?.message || "Operation failed",
      },
    );
  };

  return {
    formData,
    setFormData,
    isLoading,
    creating,
    updating,
    isEdit,
    handleChange,
    handleDropdownChange,
    handleSubmit,
  };
}
