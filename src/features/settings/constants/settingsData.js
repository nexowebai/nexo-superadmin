import { Settings as SettingsIcon, Shield, Palette } from "lucide-react";

export const CHART_THEMES = [
  {
    id: "default",
    name: "Nexo Professional",
    colors: ["#10b981", "#14b8a6", "#0f766e", "#0d9488", "#64748b"],
  },
  {
    id: "pastel",
    name: "Soft Pastel",
    colors: ["#a7f3d0", "#ccfbf1", "#f0fdfa", "#fdf2f8", "#f1f5f9"],
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    colors: ["#0ea5e9", "#06b6d4", "#2dd4bf", "#38bdf8", "#7dd3fc"],
  },
];

export const TAB_OPTIONS = [
  { value: "general", label: "Primary Config", icon: SettingsIcon },
  { value: "appearance", label: "Visual Interface", icon: Palette },
  { value: "access", label: "Platform Security", icon: Shield },
];

export const INITIAL_SETTINGS = {
  system_name: "Nexo Admin",
  max_file_size_mb: 10,
  support_email: "support@nexo.com",
  backup_enabled: false,
  smtp_enabled: false,
  smtp_host: "",
  smtp_port: "",
  can_field_user_view_submission: true,
};
