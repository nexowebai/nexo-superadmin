import React from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { TabWrapper, ConfigCard, Label, ThemeChoice, PaletteCard } from './SettingsComponents';
import { CHART_THEMES } from '../constants/settingsData';

export function AppearanceTab({ theme, setTheme }) {
    return (
        <TabWrapper>
            <ConfigCard
                icon={Palette}
                title="Visual Intelligence"
                desc="Interface aesthetics and data visualization preferences."
                variant="info"
            >
                <div className="settings-stack">
                    <div className="settings-group">
                        <Label text="Global Chromatic Mode" />
                        <div className="theme-selection-grid">
                            <ThemeChoice
                                mode="light"
                                current={theme}
                                onSelect={setTheme}
                                icon={Sun}
                                label="Luminous"
                            />
                            <ThemeChoice
                                mode="dark"
                                current={theme}
                                onSelect={setTheme}
                                icon={Moon}
                                label="Nocturnal"
                            />
                        </div>
                    </div>

                    <div className="settings-group">
                        <Label text="Telemetry Palettes" />
                        <div className="palette-selection-grid">
                            {CHART_THEMES.map(t => (
                                <PaletteCard
                                    key={t.id}
                                    theme={t}
                                    active={t.id === 'default'}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </ConfigCard>
        </TabWrapper>
    );
}
