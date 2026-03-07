import React from 'react';
import { Globe, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Switch } from '@components/ui';
import { TabWrapper, ConfigCard, InputGroup } from './SettingsComponents';

export function GeneralTab({ settings, handleChange, setSettingValue }) {
    return (
        <TabWrapper>
            <ConfigCard
                icon={Globe}
                title="Core Ecosystem"
                desc="Primary identity and delivery constraints for the master instance."
                variant="primary"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex items-center justify-between p-5 bg-surface-subtle rounded-md border border-base mb-6 border-l-4 border-l-blue-500">
                    <div className="space-y-1">
                        <span className="block font-black text-primary text-sm uppercase tracking-tight">Enable Telemetry Delivery</span>
                        <span className="text-[11px] text-muted font-bold italic opacity-70">Route high-priority events through custom relay.</span>
                    </div>
                    <Switch
                        checked={settings.smtp_enabled}
                        onChange={(val) => setSettingValue('smtp_enabled', val)}
                    />
                </div>

                <AnimatePresence>
                    {settings.smtp_enabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </ConfigCard>
        </TabWrapper>
    );
}
