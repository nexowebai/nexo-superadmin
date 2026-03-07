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
                <div className="space-y-12">
                    <div>
                        <Label text="Global Chromatic Mode" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
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

                    <div>
                        <Label text="Telemetry Palettes" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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
