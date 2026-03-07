import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon, Save, Shield, Palette, Check,
    AlertTriangle, CheckCircle2, Sun, Moon, Mail, Cpu, Globe, Activity
} from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Button, Skeleton, Tabs, Switch } from '@components/ui';
import { useTheme, useLayout } from '@context';
import { useSystemSettings, useUpdateSettings } from '../../hooks/';
import { cn } from '@lib/cn';
import notify from '@utils/notify';
import './SettingsPage.css';

const CHART_THEMES = [
    { id: 'default', name: 'Nexo Professional', colors: ['#10b981', '#14b8a6', '#0f766e', '#0d9488', '#64748b'] },
    { id: 'pastel', name: 'Soft Pastel', colors: ['#a7f3d0', '#ccfbf1', '#f0fdfa', '#fdf2f8', '#f1f5f9'] },
    { id: 'ocean', name: 'Ocean Breeze', colors: ['#0ea5e9', '#06b6d4', '#2dd4bf', '#38bdf8', '#7dd3fc'] },
];

const TAB_OPTIONS = [
    { value: 'general', label: 'Primary Config', icon: SettingsIcon },
    { value: 'appearance', label: 'Visual Interface', icon: Palette },
    { value: 'access', label: 'Platform Security', icon: Shield },
];

function SettingsSkeleton() {
    return (
        <div className="settings-skeleton-v2 p-8 space-y-8">
            <div className="flex gap-4">
                <Skeleton width="180px" height="56px" borderRadius="16px" />
                <Skeleton width="180px" height="56px" borderRadius="16px" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton width="100%" height="300px" borderRadius="24px" />
                    <Skeleton width="100%" height="250px" borderRadius="24px" />
                </div>
                <Skeleton width="100%" height="450px" borderRadius="24px" />
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { mode: appTheme, setTheme: setAppTheme } = useTheme();
    const { setHeaderProps } = useLayout();
    const { data, isLoading } = useSystemSettings();
    const { mutate: updateSettings } = useUpdateSettings();

    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        system_name: 'Nexo Admin',
        max_file_size_mb: 10,
        support_email: 'support@nexo.com',
        backup_enabled: false,
        smtp_enabled: false,
        smtp_host: '',
        smtp_port: '',
        can_field_user_view_submission: true,
    });

    const initialDataRef = useRef(null);

    useEffect(() => {
        if (data) {
            const apiSettings = {
                system_name: data.system_name || 'Nexo Admin',
                max_file_size_mb: data.max_file_size_mb || 10,
                support_email: data.support_email || 'support@nexo.com',
                backup_enabled: data.backup_enabled || false,
                smtp_enabled: data.smtp_enabled || false,
                smtp_host: data.smtp_host || '',
                smtp_port: data.smtp_port || '',
                can_field_user_view_submission: data.can_field_user_view_submission ?? true,
            };
            initialDataRef.current = apiSettings;
            setSettings(apiSettings);
        }
    }, [data]);

    useEffect(() => {
        setHeaderProps({
            title: 'Infrastructure Preferences',
            action: (
                <Button
                    variant="primary"
                    icon={Save}
                    form="settings-form"
                    className="h-11 px-8 rounded-md font-bold uppercase tracking-wider text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Sync State
                </Button>
            )
        });
    }, [setHeaderProps]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const changedFields = {};
        const initial = initialDataRef.current || {};

        Object.keys(settings).forEach(key => {
            if (settings[key] !== initial[key]) changedFields[key] = settings[key];
        });

        if (Object.keys(changedFields).length === 0) {
            notify.info('No environmental changes detected');
            return;
        }

        notify.promise(
            new Promise((resolve, reject) => {
                updateSettings(changedFields, {
                    onSuccess: () => {
                        initialDataRef.current = { ...settings };
                        resolve();
                    },
                    onError: reject,
                });
            }),
            {
                loading: 'Synchronizing global state...',
                success: 'Infrastructure updated successfully',
                error: (err) => err?.message || 'Sync failed',
            }
        );
    };

    if (isLoading) return <PageContainer><SettingsSkeleton /></PageContainer>;

    return (
        <PageContainer>
            <div className="settings-v2-premium">
                <div className="glass-nav mb-8 p-1 bg-white border border-base rounded-md w-fit shadow-sm">
                    <Tabs options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} variant="premium" />
                </div>

                <form id="settings-form" className="settings-grid" onSubmit={handleSubmit}>
                    <div className="settings-main-column">
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <TabWrapper key="general">
                                    <ConfigCard
                                        icon={Globe}
                                        title="Core Ecosystem"
                                        desc="Primary identity and delivery constraints for the master instance."
                                        variant="primary"
                                    >
                                        <div className="form-grid-2">
                                            <InputGroup label="Instance Alias" name="system_name" value={settings.system_name} onChange={handleChange} hint="Global identifier across all platform modules." />
                                            <InputGroup label="Contact Matrix" name="support_email" value={settings.support_email} onChange={handleChange} type="email" hint="Escalation endpoint for critical support." />
                                            <InputGroup label="IO Buffer (MB)" name="max_file_size_mb" value={settings.max_file_size_mb} onChange={handleChange} type="number" hint="Absolute cap for binary packet delivery." />
                                        </div>
                                    </ConfigCard>

                                    <ConfigCard
                                        icon={Mail}
                                        title="Protocol Routing"
                                        desc="SMTP configuration for transactional telemetry and alerts."
                                        variant="secondary"
                                    >
                                        <div className="flex items-center justify-between p-4 bg-white rounded-md border border-base mb-6 border-l-4 border-l-secondary">
                                            <div>
                                                <span className="block font-bold text-primary text-sm uppercase">Enable Telemetry Delivery</span>
                                                <span className="text-[11px] text-muted font-medium italic">Route high-priority events through custom relay.</span>
                                            </div>
                                            <Switch checked={settings.smtp_enabled} onChange={(val) => setSettings(p => ({ ...p, smtp_enabled: val }))} />
                                        </div>

                                        <AnimatePresence>
                                            {settings.smtp_enabled && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <div className="form-grid-2 pt-2">
                                                        <InputGroup label="Relay Endpoint" name="smtp_host" value={settings.smtp_host} onChange={handleChange} />
                                                        <InputGroup label="Access Port" name="smtp_port" value={settings.smtp_port} onChange={handleChange} type="number" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </ConfigCard>
                                </TabWrapper>
                            )}

                            {activeTab === 'appearance' && (
                                <TabWrapper key="appearance">
                                    <ConfigCard
                                        icon={Palette}
                                        title="Visual Intelligence"
                                        desc="Interface aesthetics and data visualization preferences."
                                        variant="info"
                                    >
                                        <div className="space-y-10">
                                            <div>
                                                <Label text="Global Chromatic Mode" />
                                                <div className="theme-selector-grid">
                                                    <ThemeChoice mode="light" current={appTheme} onSelect={setAppTheme} icon={Sun} label="Luminous" />
                                                    <ThemeChoice mode="dark" current={appTheme} onSelect={setAppTheme} icon={Moon} label="Nocturnal" />
                                                </div>
                                            </div>

                                            <div>
                                                <Label text="Telemetry Palettes" />
                                                <div className="chart-palette-grid">
                                                    {CHART_THEMES.map(t => (
                                                        <PaletteCard key={t.id} theme={t} active={t.id === 'default'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </ConfigCard>
                                </TabWrapper>
                            )}

                            {activeTab === 'access' && (
                                <TabWrapper key="access">
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
                                                onChange={(val) => setSettings(p => ({ ...p, can_field_user_view_submission: val }))}
                                            />
                                            <ToggleRow
                                                title="Snapshot Redundancy"
                                                desc="Enable automated 24h binary backups for disaster recovery."
                                                checked={settings.backup_enabled}
                                                onChange={(val) => setSettings(p => ({ ...p, backup_enabled: val }))}
                                            />
                                        </div>
                                    </ConfigCard>

                                    <div className="p-6 bg-rose-50 border border-rose-200 rounded-md overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                                            <AlertTriangle size={80} />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-lg font-bold text-rose-700 mb-2 tracking-tight">Critical Overrides</h4>
                                            <p className="text-sm font-medium text-rose-600/70 mb-6 max-w-md">Operations here affect instance integrity and data availability across all organizations.</p>
                                            <div className="flex gap-4">
                                                <Button variant="danger" className="h-10 px-6 rounded-md">Flush Master Cache</Button>
                                                <Button variant="ghost" className="h-10 px-6 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-100">Restart Engine</Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabWrapper>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="settings-sidebar-column">
                        <div className="info-card-premium bg-white">
                            <div className="w-20 h-20 rounded-md bg-zinc-50 text-primary flex items-center justify-center mx-auto mb-6 border border-base shadow-sm">
                                <Cpu size={32} strokeWidth={2} />
                            </div>
                            <h4 className="text-2xl font-black text-primary text-center mb-1 tracking-tight">{settings.system_name}</h4>
                            <div className="mx-auto w-fit px-3 py-1 bg-primary text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-full mb-8">
                                Production v4.2
                            </div>

                            <div className="space-y-4">
                                <ResourceMetric label="Resource Load" value="78.4%" />
                                <ResourceMetric label="API Latency" value="42ms" />
                                <ResourceMetric label="Encryption" value="AES-256" />
                            </div>
                        </div>

                        <div className="status-banner mt-6 p-5 bg-zinc-50 rounded-md border border-base flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-glow-primary">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h5 className="text-[11px] font-black text-primary uppercase tracking-[0.1em] mb-1">Live Engine Status</h5>
                                <p className="text-[10px] leading-relaxed font-bold text-primary/70 mb-0 italic">Changes synchronize across organization nodes within 45 seconds of state commit.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </PageContainer>
    );
}

// Minimalistic UI Helpers
const TabWrapper = ({ children }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className="space-y-8">
        {children}
    </motion.div>
);

const ConfigCard = ({ icon: Icon, title, desc, children, variant = 'primary' }) => (
    <div className="premium-card">
        <div className="card-header-nx">
            <div className={cn("w-12 h-12 rounded-md flex items-center justify-center border shadow-sm", `bg-${variant}-soft text-${variant} border-${variant}/20`)}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-primary tracking-tight">{title}</h3>
                <p className="text-sm font-medium text-muted opacity-80">{desc}</p>
            </div>
        </div>
        <div className="p-8">{children}</div>
    </div>
);


const InputGroup = ({ label, hint, ...props }) => (
    <div className="space-y-2.5">
        <Label text={label} />
        <input className="premium-input w-full" {...props} />
        {hint && <p className="text-[10px] font-bold text-muted/60 lowercase italic ml-1 tracking-wide">{hint}</p>}
    </div>
);

const Label = ({ text }) => (
    <span className="text-[11px] font-black text-primary uppercase tracking-[0.15em] ml-1">{text}</span>
);

const ToggleRow = ({ title, desc, checked, onChange }) => (
    <div className="py-6 flex items-center justify-between">
        <div className="max-w-[80%]">
            <span className="block font-black text-primary text-base tracking-tight">{title}</span>
            <span className="text-xs font-bold text-muted opacity-70 leading-relaxed">{desc}</span>
        </div>
        <Switch checked={checked} onChange={onChange} />
    </div>
);

const ThemeChoice = ({ mode, current, onSelect, icon: Icon, label }) => (
    <button type="button" onClick={() => onSelect(mode)} className={cn("theme-choice-btn", current === mode && "active")}>
        <div className={cn("theme-preview", mode)} />
        <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-2">
                <Icon size={16} className={mode === 'light' ? 'text-warning' : 'text-primary'} />
                <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
            </div>
            {current === mode && <Check size={14} className="text-primary" strokeWidth={3} />}
        </div>
    </button>
);

const PaletteCard = ({ theme, active }) => (
    <div className={cn("palette-preview-card", active && "active")}>
        <div className="flex gap-1.5 mb-3">
            {theme.colors.map((c, i) => <div key={i} className="h-4 flex-1 rounded-md" style={{ background: c }} />)}
        </div>
        <div className="flex justify-between items-center text-[10px] font-black text-muted/60 uppercase tracking-widest">
            {theme.name}
            {active && <CheckCircle2 size={12} className="text-primary" />}
        </div>
    </div>
);

const ResourceMetric = ({ label, value }) => (
    <div className="flex justify-between items-center p-3 rounded-md bg-white border border-base">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold text-primary">{value}</span>
    </div>
);

