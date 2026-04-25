import { Settings as SettingsIcon, Shield, Palette } from "lucide-react";
import { APP_THEMES } from "../../../constants/themePalettes";

export { APP_THEMES };

export const TAB_OPTIONS = [
  { value: "general", label: "Primary Config", icon: SettingsIcon },
  { value: "appearance", label: "Visual Interface", icon: Palette },
  { value: "access", label: "Platform Security", icon: Shield },
];

export const INITIAL_SETTINGS = {
  system_name: "Nexo Admin",
  theme_color: "emerald",
  max_file_size_mb: 10,
  support_email: "support@nexo.com",
  backup_enabled: false,
  smtp_enabled: false,
  smtp_host: "",
  smtp_port: "",
  can_field_user_view_submission: true,
};
