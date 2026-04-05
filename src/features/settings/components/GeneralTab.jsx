import { Globe, Mail } from "lucide-react";
import { Switch } from "@components/ui";
import { TabWrapper, ConfigCard, InputGroup } from "./SettingsComponents";

export function GeneralTab({ settings, handleChange, setSettingValue }) {
  return (
    <TabWrapper>
      <ConfigCard
        icon={Globe}
        title="Core Ecosystem"
        desc="Primary identity and delivery constraints for the master instance."
        variant="primary"
      >
        <div className="settings-field-grid">
          <InputGroup
            label="Instance Alias"
            name="system_name"
            value={settings.system_name}
            onChange={handleChange}
            hint="Global identifier across all platform modules."
          />
          <InputGroup
            label="Contact Matrix"
            name="support_email"
            value={settings.support_email}
            onChange={handleChange}
            type="email"
            hint="Escalation endpoint for critical support."
          />
          <InputGroup
            label="IO Buffer (MB)"
            name="max_file_size_mb"
            value={settings.max_file_size_mb}
            onChange={handleChange}
            type="number"
            hint="Absolute cap for binary packet delivery."
          />
        </div>
      </ConfigCard>

      <ConfigCard
        icon={Mail}
        title="Protocol Routing"
        desc="SMTP configuration for transactional telemetry and alerts."
        variant="secondary"
      >
        <div className="telemetry-switch-card">
          <div className="telemetry-switch-content">
            <span className="telemetry-label">Enable Telemetry Delivery</span>
            <span className="telemetry-hint">
              Route high-priority events through custom relay.
            </span>
          </div>
          <Switch
            checked={settings.smtp_enabled}
            onChange={(val) => setSettingValue("smtp_enabled", val)}
          />
        </div>

        {settings.smtp_enabled && (
          <div className="settings-field-grid">
            <InputGroup
              label="Relay Endpoint"
              name="smtp_host"
              value={settings.smtp_host}
              onChange={handleChange}
            />
            <InputGroup
              label="Access Port"
              name="smtp_port"
              value={settings.smtp_port}
              onChange={handleChange}
              type="number"
            />
          </div>
        )}
      </ConfigCard>
    </TabWrapper>
  );
}
