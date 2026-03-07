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
                <div className="divide-y divide-base/30">
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

            <div className="p-8 bg-rose-50 border border-rose-200 rounded-md overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                    <AlertTriangle size={80} />
                </div>
                <div className="relative z-10">
                    <h4 className="text-xl font-bold text-rose-700 mb-2 tracking-tight">Critical Overrides</h4>
                    <p className="text-sm font-bold text-rose-600/70 mb-8 max-w-md leading-relaxed">
                        Operations here affect instance integrity and data availability across all organization nodes.
                        Proceed with extreme caution as these actions cannot be undone.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="danger" className="h-11 px-8 rounded-md font-bold uppercase tracking-wider text-[11px]">
                            Flush Master Cache
                        </Button>
                        <Button variant="ghost" className="h-11 px-8 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold uppercase tracking-wider text-[11px]">
                            Restart Engine
                        </Button>
                    </div>
                </div>
            </div>
        </TabWrapper>
    );
}
