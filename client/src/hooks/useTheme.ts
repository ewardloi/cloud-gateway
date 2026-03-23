import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'light' | 'dark';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem('themeMode') as ThemeMode) ?? 'auto',
  );

  const getSystemDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const colorScheme: ColorScheme =
    mode === 'auto' ? (getSystemDark() ? 'dark' : 'light') : mode;

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  return { mode, setMode, colorScheme };
}
