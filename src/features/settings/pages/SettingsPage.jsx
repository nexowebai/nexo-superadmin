import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Save } from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Button, Tabs } from '@components/ui';
import { useTheme, useLayout } from '@context';

// Feature-specific
import { useSettingsPage } from '../hooks/useSettingsPage';
import { TAB_OPTIONS } from '../constants/settingsData';
import { GeneralTab } from '../components/GeneralTab';
import { AppearanceTab } from '../components/AppearanceTab';
import { SecurityTab } from '../components/SecurityTab';
import { SettingsSidebar } from '../components/SettingsSidebar';
import { SettingsSkeleton } from '../components/SettingsSkeleton';

import './SettingsPage.css';

export default function SettingsPage() {
    const { mode: appTheme, setTheme: setAppTheme } = useTheme();
    const { setHeaderProps } = useLayout();

    const {
        isLoading,
        activeTab,
        setActiveTab,
        settings,
        setSettingValue,
        handleChange,
        handleSubmit
    } = useSettingsPage();

    useEffect(() => {
        setHeaderProps({
            title: 'Settings & Preferences',
            action: (
                <Button
                    variant="primary"
                    icon={Save}
                    form="settings-form"
                >
                    Sync State
                </Button>
            )
        });
    }, [setHeaderProps]);

    if (isLoading) return <PageContainer><SettingsSkeleton /></PageContainer>;

    return (
        <PageContainer className="settings-page-v2 pb-12">
            <div className="settings-v2-premium">
                <div className="mb-8 flex justify-center">
                    <Tabs
                        options={TAB_OPTIONS}
                        value={activeTab}
                        onChange={setActiveTab}
                        variant="premium"
                    />
                </div>

                <form id="settings-form" className="settings-grid" onSubmit={handleSubmit}>
                    <div className="settings-main-column">
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <GeneralTab
                                    key="general"
                                    settings={settings}
                                    handleChange={handleChange}
                                    setSettingValue={setSettingValue}
                                />
                            )}

                            {activeTab === 'appearance' && (
                                <AppearanceTab
                                    key="appearance"
                                    theme={appTheme}
                                    setTheme={setAppTheme}
                                />
                            )}

                            {activeTab === 'access' && (
                                <SecurityTab
                                    key="access"
                                    settings={settings}
                                    setSettingValue={setSettingValue}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="settings-sidebar-column">
                        <SettingsSidebar systemName={settings.system_name} />
                    </div>
                </form>
            </div>
        </PageContainer>
    );
}
