import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganization, useCreateOrganization, useUpdateOrganization } from "./useOrganizations";
import notify from "@utils/notify";

export function useCreateOrganizationPage(id) {
  const navigate = useNavigate();
  const isEdit = !!id;
  const initialDataRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "", org_code: "", email: "", logo: "",
    subscription_tier: "professional", plan_type: "yearly",
    max_users: 100, max_projects: 25,
    plan_starts_at: new Date().toISOString().split("T")[0],
    plan_expires_at: "", admin_email: "", admin_first_name: "",
    admin_last_name: "", admin_phone: "", temp_password: "",
  });

  const { data: orgData, isLoading } = useOrganization(id);
  const { mutateAsync: createOrg, isPending: creating } = useCreateOrganization();
  const { mutateAsync: updateOrg, isPending: updating } = useUpdateOrganization();

  useEffect(() => {
    const limits = { basic: 25, professional: 100, enterprise: 500 };
    setFormData(p => ({ ...p, max_users: limits[p.subscription_tier] || p.max_users }));
  }, [formData.subscription_tier]);

  useEffect(() => {
    if (!formData.plan_starts_at) return;
    const end = new Date(formData.plan_starts_at);
    if (isNaN(end.getTime())) return;
    formData.plan_type === "yearly" ? end.setFullYear(end.getFullYear() + 1) : end.setMonth(end.getMonth() + 1);
    setFormData(p => ({ ...p, plan_expires_at: end.toISOString().split("T")[0] }));
  }, [formData.plan_starts_at, formData.plan_type]);

  useEffect(() => {
    if (isEdit && orgData) {
      const initial = {
        name: orgData.name || "", org_code: orgData.org_code || "", email: orgData.email || "", logo: orgData.logo || "",
        subscription_tier: orgData.subscription_tier?.toLowerCase() || "professional",
        plan_type: orgData.plan_type?.toLowerCase() || "yearly",
        max_users: orgData.max_users || 100, max_projects: orgData.max_projects || 25,
        plan_starts_at: (orgData.plan_starts_at || new Date().toISOString()).split("T")[0],
        plan_expires_at: (orgData.plan_expires_at || "").split("T")[0],
      };
      initialDataRef.current = initial;
      setFormData(p => ({ ...p, ...initial }));
    }
  }, [isEdit, orgData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  }, []);

  const handleDropdownChange = useCallback((n, v) => setFormData(p => ({ ...p, [n]: v })), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = isEdit ? getChangedFields(formData, initialDataRef.current) : { ...formData, max_users: parseInt(formData.max_users), max_projects: parseInt(formData.max_projects) };
    const promise = isEdit ? updateOrg({ id, data: payload }) : createOrg(payload);

    notify.promise(promise.then(() => navigate(isEdit ? `/organizations/${id}` : "/organizations")), {
      loading: `${isEdit ? "Updating" : "Creating"} organization...`,
      success: `Organization ${isEdit ? "updated" : "created"} successfully!`,
      error: (err) => err?.message || "Operation failed",
    });
  };

  return { formData, isLoading, creating, updating, isEdit, handleChange, handleDropdownChange, handleSubmit };
}

function getChangedFields(current, initial) {
  const changed = {};
  const base = initial || {};
  Object.keys(current).forEach(k => {
    if (current[k] !== base[k]) {
      changed[k] = (k === "max_users" || k === "max_projects") ? parseInt(current[k]) : current[k];
    }
  });
  return changed;
}
