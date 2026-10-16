import React, { createContext, useContext, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { vars } from 'nativewind';
import { getThemeSetting, setThemeSetting, type ThemePreference } from '../utils/database';
import { palettes, toCssVariables, type Palette } from './tokens';

interface ThemeContextType {
  isDark: boolean;
  /** Resolved colours for props that can't take a className (icons, placeholders, navigation) */
  colors: Palette;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeVars = {
  light: vars(toCssVariables(palettes.light)),
  dark: vars(toCssVariables(palettes.dark)),
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(getThemeSetting);

  const isDark = preference === 'system' ? systemScheme === 'dark' : preference === 'dark';
  const scheme = isDark ? 'dark' : 'light';

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    setThemeSetting(next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors: palettes[scheme], preference, setPreference }}>
      {/* CSS variables for every Tailwind colour class below this point */}
      <View style={[{ flex: 1 }, themeVars[scheme]]}>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
