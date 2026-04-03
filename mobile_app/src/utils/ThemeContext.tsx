import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { getThemeSetting, initializeDatabase, setThemeSetting } from './database';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initializeDatabase();
    const theme = getThemeSetting();

    if (theme) {
      setIsDark(theme === 'dark');
      return;
    }

    setIsDark(Appearance.getColorScheme() === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    setThemeSetting(newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};