import { useState, useEffect, useRef, useCallback } from 'react';
import { useSystemSettings, useUpdateSettings } from './useSettings';
import { INITIAL_SETTINGS } from '../constants/settingsData';
import notify from '@utils/notify';

export function useSettingsPage() {
    const { data, isLoading } = useSystemSettings();
    const { mutate: updateSettings } = useUpdateSettings();

    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const initialDataRef = useRef(null);

    useEffect(() => {
        if (data) {
            const apiSettings = {
                system_name: data.system_name || INITIAL_SETTINGS.system_name,
                max_file_size_mb: data.max_file_size_mb || INITIAL_SETTINGS.max_file_size_mb,
                support_email: data.support_email || INITIAL_SETTINGS.support_email,
                backup_enabled: data.backup_enabled || INITIAL_SETTINGS.backup_enabled,
                smtp_enabled: data.smtp_enabled || INITIAL_SETTINGS.smtp_enabled,
                smtp_host: data.smtp_host || INITIAL_SETTINGS.smtp_host,
                smtp_port: data.smtp_port || INITIAL_SETTINGS.smtp_port,
                can_field_user_view_submission: data.can_field_user_view_submission ?? INITIAL_SETTINGS.can_field_user_view_submission,
            };
            initialDataRef.current = apiSettings;
            setSettings(apiSettings);
        }
    }, [data]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
        }));
    }, []);

    const setSettingValue = useCallback((name, value) => {
        setSettings(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e) => {
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
    }, [settings, updateSettings]);

    return {
        isLoading,
        activeTab,
        setActiveTab,
        settings,
        setSettingValue,
        handleChange,
        handleSubmit
    };
}
