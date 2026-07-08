'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'kids' | 'normal';
type ThemeColor = 'light' | 'dark' | 'purple';

interface ThemeContextType {
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: (color: ThemeColor) => void;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('normal');
  const [themeColor, setThemeColorState] = useState<ThemeColor>('dark'); // Default to dark mode
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColor = localStorage.getItem('theme-color') as ThemeColor;

    if (savedMode) setThemeModeState(savedMode);
    if (savedColor) setThemeColorState(savedColor);
    setMounted(true);
  }, []);

  // Update HTML element classes when theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    
    // Remove existing classes
    root.classList.remove('theme-kids', 'theme-normal');
    root.classList.remove('color-light', 'color-dark', 'color-purple');

    // Add current classes
    root.classList.add(`theme-${themeMode}`);
    root.classList.add(`color-${themeColor}`);

    // If dark or purple, add 'dark' for tailwind dark selector support
    if (['dark', 'purple'].includes(themeColor)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme-mode', themeMode);
    localStorage.setItem('theme-color', themeColor);
  }, [themeMode, themeColor, mounted]);

  const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);
  const setThemeColor = (color: ThemeColor) => setThemeColorState(color);
  const toggleThemeMode = () => setThemeModeState(prev => prev === 'kids' ? 'normal' : 'kids');

  return (
    <ThemeContext.Provider value={{ themeMode, themeColor, setThemeMode, setThemeColor, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
