import { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Save, Shield, Palette, Check } from 'lucide-react';
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
    { id: 'default', name: 'DataStride Default', colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] },
    { id: 'pastel', name: 'Soft Pastel', colors: ['#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#c4b5fd'] },
    { id: 'ocean', name: 'Ocean Breeze', colors: ['#0ea5e9', '#06b6d4', '#2dd4bf', '#38bdf8', '#7dd3fc'] },
];

const TAB_OPTIONS = [
    { value: 'general', label: 'General', icon: SettingsIcon },
    { value: 'appearance', label: 'Appearance', icon: Palette },
    { value: 'access', label: 'Access Control', icon: Shield },
];

function SettingsSkeleton() {
    return (
        <div className="settings-skeleton">
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                <Skeleton width="120px" height="44px" borderRadius="10px" />
                <Skeleton width="120px" height="44px" borderRadius="10px" />
                <Skeleton width="120px" height="44px" borderRadius="10px" />
            </div>
            <div className="form-section" style={{ maxWidth: 900 }}>
                <div className="form-section-header">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <Skeleton width="22px" height="22px" borderRadius="6px" />
                        <div>
                            <Skeleton width="200px" height="20px" />
                            <Skeleton width="300px" height="14px" style={{ marginTop: 8 }} />
                        </div>
                    </div>
                </div>
                <div className="form-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="form-field">
                            <Skeleton width="100px" height="14px" />
                            <Skeleton width="100%" height="44px" borderRadius="10px" style={{ marginTop: 8 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SettingsPage() {
    const { theme: appTheme, setTheme: setAppTheme } = useTheme();
    const { setHeaderProps } = useLayout();
    const { data, isLoading } = useSystemSettings();
    const { mutate: updateSettings } = useUpdateSettings();

    useEffect(() => {
        setHeaderProps({ title: 'System Settings' });
    }, [setHeaderProps]);

    const [activeTab, setActiveTab] = useState('general');
    const initialDataRef = useRef(null);

    const [settings, setSettings] = useState({
        system_name: 'DataStride',
        max_file_size_mb: 10,
        allowed_file_types: ['image/jpeg', 'image/png', 'application/pdf'],
        backup_enabled: false,
        smtp_enabled: false,
        smtp_host: '',
        smtp_port: '',
        can_field_user_view_submission: true,
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
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
                primary_color: data.primary_color || '#3B82F6',
                secondary_color: data.secondary_color || '#10B981',
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
        e.preventDefault();

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
                loading: 'Saving settings...',
                success: 'Settings updated successfully!',
                error: (err) => err?.message || 'Failed to update settings',
            }
        );
    };

    return (
        <PageContainer>
            <div className="settings-content-wrapper">
                <Tabs options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} className="mb-6" />

                {isLoading ? (
                    <SettingsSkeleton />
                ) : (
                    <form className="settings-form-full" onSubmit={handleSubmit}>
                        {activeTab === 'general' && (
                            <div className="form-section full-width">
                                <div className="form-section-header">
                                    <h3 className="text-lg font-semibold text-primary">General Configuration</h3>
                                    <p className="text-sm text-secondary">Basic platform details and defaults.</p>
                                </div>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>System Name</label>
                                        <input type="text" name="system_name" value={settings.system_name} onChange={handleChange} placeholder="DataStride" />
                                    </div>
                                    <div className="form-field">
                                        <label>Max File Size (MB)</label>
                                        <input type="number" name="max_file_size_mb" value={settings.max_file_size_mb} onChange={handleChange} min="1" max="100" />
                                    </div>
                                    <div className="form-field">
                                        <label>Primary Color</label>
                                        <div className="color-input-wrapper">
                                            <input type="color" name="primary_color" value={settings.primary_color} onChange={handleChange} />
                                            <input type="text" value={settings.primary_color} onChange={handleChange} name="primary_color" />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Secondary Color</label>
                                        <div className="color-input-wrapper">
                                            <input type="color" name="secondary_color" value={settings.secondary_color} onChange={handleChange} />
                                            <input type="text" value={settings.secondary_color} onChange={handleChange} name="secondary_color" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="form-section full-width">
                                <div className="form-section-header">
                                    <h3 className="text-lg font-semibold text-primary">Appearance Settings</h3>
                                    <p className="text-sm text-secondary">Customize the visual appearance (stored locally).</p>
                                </div>

                                <div className="theme-mode-section">
                                    <h4>Application Theme</h4>
                                    <div className="theme-mode-buttons">
                                        <button type="button" className={cn('theme-mode-btn', appTheme === 'dark' && 'active')} onClick={() => handleAppThemeToggle('dark')}>
                                            🌙 Dark Mode
                                        </button>
                                        <button type="button" className={cn('theme-mode-btn', appTheme === 'light' && 'active')} onClick={() => handleAppThemeToggle('light')}>
                                            ☀️ Light Mode
                                        </button>
                                    </div>
                                </div>

                                <div className="chart-theme-section">
                                    <h4>Chart & Graph Theme</h4>
                                    <div className="theme-grid">
                                        {CHART_THEMES.map(theme => (
                                            <div key={theme.id} className={cn('theme-card', chartTheme === theme.id && 'active')} onClick={() => handleThemeSelect(theme.id)}>
                                                <div className="theme-preview">
                                                    {theme.colors.map((color, i) => (
                                                        <div key={i} className="theme-color-swatch" style={{ background: color }} />
                                                    ))}
                                                </div>
                                                <div className="theme-info">
                                                    <span className="theme-name">{theme.name}</span>
                                                    {chartTheme === theme.id && <Check size={16} className="text-brand-500" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'access' && (
                            <div className="form-section full-width">
                                <div className="form-section-header">
                                    <h3 className="text-lg font-semibold text-primary">Access Control</h3>
                                    <p className="text-sm text-secondary">Manage permissions and backup settings.</p>
                                </div>
                                <div className="settings-toggles">
                                    <label className="toggle-field">
                                        <input type="checkbox" name="can_field_user_view_submission" checked={settings.can_field_user_view_submission} onChange={handleChange} />
                                        <span className="toggle-switch"></span>
                                        <div className="toggle-info">
                                            <span className="toggle-label">Field User View Submissions</span>
                                            <span className="toggle-desc">Allow field users to view their submitted data</span>
                                        </div>
                                    </label>
                                    <label className="toggle-field">
                                        <input type="checkbox" name="backup_enabled" checked={settings.backup_enabled} onChange={handleChange} />
                                        <span className="toggle-switch"></span>
                                        <div className="toggle-info">
                                            <span className="toggle-label">Automatic Backup</span>
                                            <span className="toggle-desc">Enable automatic database backups</span>
                                        </div>
                                    </label>
                                    <label className="toggle-field">
                                        <input type="checkbox" name="smtp_enabled" checked={settings.smtp_enabled} onChange={handleChange} />
                                        <span className="toggle-switch"></span>
                                        <div className="toggle-info">
                                            <span className="toggle-label">SMTP Enabled</span>
                                            <span className="toggle-desc">Enable email notifications via SMTP</span>
                                        </div>
                                    </label>
                                </div>

                                {settings.smtp_enabled && (
                                    <div className="form-grid" style={{ marginTop: 'var(--ds-space-5)' }}>
                                        <div className="form-field">
                                            <label>SMTP Host</label>
                                            <input type="text" name="smtp_host" value={settings.smtp_host || ''} onChange={handleChange} placeholder="smtp.example.com" />
                                        </div>
                                        <div className="form-field">
                                            <label>SMTP Port</label>
                                            <input type="number" name="smtp_port" value={settings.smtp_port || ''} onChange={handleChange} placeholder="587" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="form-actions sticky-bottom">
                            <Button type="submit" icon={Save}>Save Changes</Button>
                        </div>
                    </form>
                )}
            </div>
        </PageContainer>
    );
}

export default SettingsPage;
