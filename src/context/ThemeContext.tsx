import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom Light Theme
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    primaryContainer: '#3B82F6',
    secondary: '#8B5CF6',
    error: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    onBackground: '#1E293B',
    onSurface: '#1E293B',
    onSurfaceVariant: '#64748B',
    outline: '#E2E8F0',
    outlineVariant: '#E2E8F0',
  },
};

// Custom Dark Theme
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3B82F6',
    primaryContainer: '#2563EB',
    secondary: '#A78BFA',
    error: '#F87171',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    onBackground: '#F1F5F9',
    onSurface: '#F1F5F9',
    onSurfaceVariant: '#CBD5E1',
    outline: '#334155',
    outlineVariant: '#475569',
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
  return context;
};


