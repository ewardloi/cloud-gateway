import { SegmentedControl, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";
import type { ThemeMode } from "../../hooks/useTheme.ts";

type ThemeToggleProps = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  return (
    <SegmentedControl
      size="xs"
      value={mode}
      onChange={(v) => onChange(v as ThemeMode)}
      data={[
        { value: "light", label: <IconSun size={14} /> },
        { value: "dark", label: <IconMoon size={14} /> },
        { value: "auto", label: <IconDeviceDesktop size={14} /> },
      ]}
    />
  );
}
