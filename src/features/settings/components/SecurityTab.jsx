import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui';
import { TabWrapper, ConfigCard, ToggleRow } from './SettingsComponents';

export function SecurityTab({ settings, setSettingValue }) {
    return (
        <TabWrapper>
            <ConfigCard
                icon={Shield}
                title="System Governance"
                desc="Fine-grained controls for platform transparency and resilience."
                variant="error"
            >
                <div className="toggle-list">
                    <ToggleRow
                        title="Field Transparency"
                        desc="Allow field agents to audit their own metadata in real-time."
                        checked={settings.can_field_user_view_submission}
                        onChange={(val) => setSettingValue('can_field_user_view_submission', val)}
                    />
                    <ToggleRow
                        title="Snapshot Redundancy"
                        desc="Enable automated 24h binary backups for disaster recovery."
                        checked={settings.backup_enabled}
                        onChange={(val) => setSettingValue('backup_enabled', val)}
                    />
                </div>
            </ConfigCard>

            <div className="critical-overrides-card">
                <div className="critical-overrides-icon-bg">
                    <AlertTriangle size={80} />
                </div>
                <div className="critical-overrides-content">
                    <h4 className="critical-overrides-title">Critical Overrides</h4>
                    <p className="critical-overrides-desc">
                        Operations here affect instance integrity and data availability across all organization nodes.
                        Proceed with extreme caution as these actions cannot be undone.
                    </p>
                    <div className="critical-overrides-actions">
                        <Button variant="danger" className="premium-btn-nx">
                            Flush Master Cache
                        </Button>
                        <Button variant="ghost" className="premium-btn-nx secondary">
                            Restart Engine
                        </Button>
                    </div>
                </div>
            </div>
        </TabWrapper>
    );
}
