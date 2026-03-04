import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon, Save, Shield, Palette, Check, Info,
    AlertTriangle, CheckCircle2, Sun, Moon, Mail
} from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { Tabs } from '@components/ui';
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

const BRAND_COLORS = [
    { id: 'green', name: 'Nexo Green', color: '#10b981' },
];

const TAB_OPTIONS = [
    { value: 'general', label: 'General', icon: SettingsIcon },
    { value: 'appearance', label: 'Appearance', icon: Palette },
    { value: 'access', label: 'Access Control', icon: Shield },
];

function SettingsSkeleton() {
    return (
        <div className="settings-skeleton">
            <div className="flex gap-4 mb-8">
                <Skeleton width="140px" height="48px" borderRadius="12px" />
                <Skeleton width="140px" height="48px" borderRadius="12px" />
                <Skeleton width="140px" height="48px" borderRadius="12px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="card-pro p-8">
                        <Skeleton width="200px" height="24px" className="mb-4" />
                        <Skeleton width="350px" height="16px" className="mb-8" />
                        <div className="grid grid-cols-2 gap-6">
                            <Skeleton width="100%" height="48px" borderRadius="10px" />
                            <Skeleton width="100%" height="48px" borderRadius="10px" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="card-pro p-8">
                        <Skeleton width="150px" height="20px" className="mb-6" />
                        <Skeleton width="100%" height="120px" borderRadius="12px" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsPage() {
    const { theme: appTheme, setTheme: setAppTheme, color: brandColor, setThemeColor } = useTheme();
    const { setHeaderProps } = useLayout();
    const { data, isLoading } = useSystemSettings();
    const { mutate: updateSettings } = useUpdateSettings();

    useEffect(() => {
        setHeaderProps({
            title: 'System Settings',
            action: (
                <Button variant="primary" icon={Save} form="settings-form" className="h-[48px] px-8">
                    Save Changes
                </Button>
            )
        });
    }, [setHeaderProps]);

    const [activeTab, setActiveTab] = useState('general');
    const initialDataRef = useRef(null);

    const [settings, setSettings] = useState({
        system_name: 'Nexo Admin',
        max_file_size_mb: 10,
        allowed_file_types: ['image/jpeg', 'image/png', 'application/pdf'],
        backup_enabled: false,
        smtp_enabled: false,
        smtp_host: '',
        smtp_port: '',
        can_field_user_view_submission: true,
        primary_color: '#10b981',
        secondary_color: '#3b82f6',
    });

    const [chartTheme, setChartTheme] = useState(() => localStorage.getItem('ds-chart-theme') || 'default');

    useEffect(() => {
        if (data) {
            const apiSettings = {
                system_name: data.system_name || 'DataStride',
                max_file_size_mb: data.max_file_size_mb || 10,
                allowed_file_types: data.allowed_file_types || ['image/jpeg', 'image/png', 'application/pdf'],
                backup_enabled: data.backup_enabled || false,
                smtp_enabled: data.smtp_enabled || false,
                smtp_host: data.smtp_host || '',
                smtp_port: data.smtp_port || '',
                can_field_user_view_submission: data.can_field_user_view_submission ?? true,
                primary_color: data.primary_color || '#10b981',
                secondary_color: data.secondary_color || '#3b82f6',
            };
            initialDataRef.current = apiSettings;
            setSettings(apiSettings);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
        }));
    };

    const handleThemeSelect = (themeId) => {
        setChartTheme(themeId);
        localStorage.setItem('ds-chart-theme', themeId);
        notify.success('Chart theme updated');
    };

    const handleAppThemeToggle = (newTheme) => {
        setAppTheme(newTheme);
        notify.success(`Switched to ${newTheme} mode`);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        const changedFields = {};
        const initial = initialDataRef.current || {};

        Object.keys(settings).forEach(key => {
            const currentValue = settings[key];
            const initialValue = initial[key];

            if (Array.isArray(currentValue)) {
                if (JSON.stringify(currentValue) !== JSON.stringify(initialValue)) {
                    changedFields[key] = currentValue;
                }
            } else if (currentValue !== initialValue) {
                changedFields[key] = currentValue;
            }
        });

        if (Object.keys(changedFields).length === 0) {
            notify.info('No changes to save');
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
                loading: 'Applying changes...',
                success: 'Settings synchronized!',
                error: (err) => err?.message || 'Synchronization failed',
            }
        );
    };

    if (isLoading) return <PageContainer><SettingsSkeleton /></PageContainer>;

    return (
        <PageContainer>
            <div className="settings-v2">
                <Tabs options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} className="mb-8 p-1 bg-elevated rounded-2xl w-fit" />

                <form id="settings-form" className="settings-v2__content" onSubmit={handleSubmit}>
                    <div className="settings-v2__main">
                        {activeTab === 'general' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="settings-card">
                                    <div className="settings-card__header">
                                        <div className="icon-box bg-primary-soft text-primary">
                                            <SettingsIcon size={24} />
                                        </div>
                                        <div className="text-content">
                                            <h3>Global Preferences</h3>
                                            <p>Manage core system defaults and storage constraints.</p>
                                        </div>
                                    </div>
                                    <div className="settings-card__body grid-2">
                                        <div className="form-field-v2">
                                            <label>Support Contact Email</label>
                                            <input type="email" name="support_email" value={settings.support_email || 'support@nexo.com'} onChange={handleChange} placeholder="support@domain.com" />
                                            <span className="field-hint">Used for help requests originating from organizations.</span>
                                        </div>
                                        <div className="form-field-v2">
                                            <label>Max Upload Size (MB)</label>
                                            <input type="number" name="max_file_size_mb" value={settings.max_file_size_mb} onChange={handleChange} min="1" max="500" />
                                            <span className="field-hint">Absolute limit for total attachment size per submission.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-card">
                                    <div className="settings-card__header">
                                        <div className="icon-box bg-secondary-soft text-secondary">
                                            <Mail size={24} />
                                        </div>
                                        <div className="text-content">
                                            <h3>SMTP Server Details</h3>
                                            <p>Configure outgoing email server for system alerts.</p>
                                        </div>
                                    </div>
                                    <div className="settings-card__body">
                                        <div className="flex items-center justify-between mb-8 p-4 bg-elevated rounded-xl">
                                            <div>
                                                <span className="block font-bold text-primary">Enable Mail Delivery</span>
                                                <span className="text-xs text-muted">Route all system emails through this SMTP server.</span>
                                            </div>
                                            <label className="toggle-v2">
                                                <input type="checkbox" name="smtp_enabled" checked={settings.smtp_enabled} onChange={handleChange} />
                                                <span className="toggle-v2__slider"></span>
                                            </label>
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
                                                        <div className="form-field-v2">
                                                            <label>SMTP Host</label>
                                                            <input type="text" name="smtp_host" value={settings.smtp_host || ''} onChange={handleChange} placeholder="smtp.mailtrap.io" />
                                                        </div>
                                                        <div className="form-field-v2">
                                                            <label>Port</label>
                                                            <input type="number" name="smtp_port" value={settings.smtp_port || ''} onChange={handleChange} placeholder="587" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'appearance' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="settings-card">
                                    <div className="settings-card__header">
                                        <div className="icon-box bg-warning-soft text-warning">
                                            <Palette size={24} />
                                        </div>
                                        <div className="text-content">
                                            <h3>User Interface Themes</h3>
                                            <p>Personalize your session aesthetic and visualization styles.</p>
                                        </div>
                                    </div>

                                    <div className="settings-card__body">

                                        <div className="mb-10">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Application Mode</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    className={cn('mode-card', appTheme === 'light' && 'mode-card--active')}
                                                    onClick={() => handleAppThemeToggle('light')}
                                                >
                                                    <div className="mode-card__preview light" />
                                                    <div className="mode-card__info">
                                                        <div className="flex items-center gap-3">
                                                            <Sun size={18} className="text-warning" />
                                                            <span>Light Aesthetics</span>
                                                        </div>
                                                        {appTheme === 'light' && <Check size={16} />}
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={cn('mode-card', appTheme === 'dark' && 'mode-card--active')}
                                                    onClick={() => handleAppThemeToggle('dark')}
                                                >
                                                    <div className="mode-card__preview dark" />
                                                    <div className="mode-card__info">
                                                        <div className="flex items-center gap-3">
                                                            <Moon size={18} className="text-primary" />
                                                            <span>Dark Aesthetics</span>
                                                        </div>
                                                        {appTheme === 'dark' && <Check size={16} />}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Brand Accent Color Removed - Forced Nexo Green */}

                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Chart Color Palettes</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {CHART_THEMES.map(theme => (
                                                    <div
                                                        key={theme.id}
                                                        className={cn('palette-card', chartTheme === theme.id && 'palette-card--active')}
                                                        onClick={() => handleThemeSelect(theme.id)}
                                                    >
                                                        <div className="palette-card__colors">
                                                            {theme.colors.map((c, i) => (
                                                                <div key={i} style={{ background: c }} />
                                                            ))}
                                                        </div>
                                                        <div className="palette-card__label">
                                                            <span>{theme.name}</span>
                                                            {chartTheme === theme.id && <CheckCircle2 size={14} />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'access' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="settings-card">
                                    <div className="settings-card__header">
                                        <div className="icon-box bg-error-soft text-error">
                                            <Shield size={24} />
                                        </div>
                                        <div className="text-content">
                                            <h3>System Governance</h3>
                                            <p>Global switches for platform behaviors and security.</p>
                                        </div>
                                    </div>

                                    <div className="settings-card__body divide-y divide-base">
                                        <div className="py-5 flex items-center justify-between">
                                            <div className="max-w-[80%]">
                                                <span className="block font-bold text-primary">Field User Transparency</span>
                                                <span className="text-sm text-muted">Allow field agents to view and audit their own submissions in real-time.</span>
                                            </div>
                                            <label className="toggle-v2">
                                                <input type="checkbox" name="can_field_user_view_submission" checked={settings.can_field_user_view_submission} onChange={handleChange} />
                                                <span className="toggle-v2__slider"></span>
                                            </label>
                                        </div>

                                        <div className="py-5 flex items-center justify-between">
                                            <div className="max-w-[80%]">
                                                <span className="block font-bold text-primary">Automated Binary Backups</span>
                                                <span className="text-sm text-muted">The system will automatically snapshot the database and S3 buckets every 24 hours.</span>
                                            </div>
                                            <label className="toggle-v2">
                                                <input type="checkbox" name="backup_enabled" checked={settings.backup_enabled} onChange={handleChange} />
                                                <span className="toggle-v2__slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-card settings-card--danger">
                                    <div className="settings-card__body">
                                        <div className="flex items-start gap-4">
                                            <div className="icon-box bg-transparent text-error p-0">
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-error text-lg">Critical Operations</h4>
                                                <p className="text-sm text-error/80 mb-6">These actions cannot be undone and affect the entire platform availability.</p>
                                                <div className="flex gap-4">
                                                    <Button variant="danger" className="h-[48px] px-6">Flush Global Cache</Button>
                                                    <Button variant="ghost" className="h-[48px] px-6 text-error hover:bg-error-soft border-error">Restart Services</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="settings-v2__sidebar">
                        <div className="card-pro p-6 bg-surface-lowest text-center">
                            <div className="w-20 h-20 bg-primary-soft text-primary rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                                <SettingsIcon size={32} />
                            </div>
                            <h4 className="font-bold text-primary text-lg">{settings.system_name}</h4>
                            <span className="text-xs font-bold text-muted uppercase tracking-widest">Master Instance</span>
                            <div className="mt-8 pt-6 border-t border-base flex flex-col gap-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted">Storage:</span>
                                    <span className="font-bold text-secondary">78.4 GB / 500 GB</span>
                                </div>
                                <div className="w-full h-1.5 bg-base rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '15.6%' }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-primary-soft/30 rounded-2xl border border-primary/10">
                            <div className="flex items-start gap-3">
                                <Info className="text-primary mt-1" size={16} />
                                <p className="text-[11px] leading-relaxed text-primary/80">
                                    <strong>Real-time Update:</strong> Changes applied here will propagate to all organizations within 60 seconds of synchronization.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </PageContainer>
    );
}

export default SettingsPage;
