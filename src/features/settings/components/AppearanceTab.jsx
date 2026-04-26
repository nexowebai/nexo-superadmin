import React from "react";
import { Palette, Sun, Moon } from "lucide-react";
import {
  TabWrapper,
  ConfigCard,
  Label,
  ThemeChoice,
  PaletteCard,
} from "./SettingsComponents";
import { APP_THEMES } from "../constants/settingsData";
import { useTheme } from "@context";

export function AppearanceTab({ theme, setTheme, settings, setSettingValue }) {
  const { setThemeColor, color: activeColorId } = useTheme();

  const handlePaletteSelect = (id) => {
    setSettingValue("theme_color", id);
    setThemeColor(id);
  };
  return (
    <TabWrapper>
      <ConfigCard
        icon={Palette}
        title="Visual Interface"
        desc="Customize the platform aesthetics and global theme highlights."
        variant="info"
      >
        <div className="settings-stack">
          <div className="settings-group">
            <Label text="Global Chromatic Mode" />
            <div className="theme-selection-grid-v2">
              <ThemeChoice
                mode="light"
                current={theme}
                onSelect={setTheme}
                label="Light"
              />
              <ThemeChoice
                mode="dark"
                current={theme}
                onSelect={setTheme}
                label="Dark"
              />
            </div>
          </div>

          <div className="settings-group">
            <Label text="Theme Accent Color" />
            <div className="palette-selection-grid-v2">
              {APP_THEMES.map((t) => (
                <PaletteCard
                  key={t.id}
                  theme={t}
                  active={activeColorId === t.id}
                  onSelect={handlePaletteSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </ConfigCard>
    </TabWrapper>
  );
}
