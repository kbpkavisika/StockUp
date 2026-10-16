import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import { OptionRow, Text } from '../components/ui';
import { useTheme } from '../theme/ThemeContext';
import type { ThemePreference } from '../utils/database';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function Settings() {
  const navigation = useNavigation();
  const { preference, setPreference } = useTheme();

  return (
    <View className="flex-1 bg-surface">
      <TopBar title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerClassName="px-4 py-6">
        <Text variant="overline" tone="secondary" className="mb-2">
          Appearance
        </Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Theme" className="border-y border-border px-2">
          {THEME_OPTIONS.map((option) => (
            <OptionRow key={option.value} label={option.label} selected={preference === option.value} onPress={() => setPreference(option.value)} />
          ))}
        </View>
        <Text variant="caption" className="mt-2">
          System follows your phone&apos;s light or dark setting.
        </Text>
      </ScrollView>
    </View>
  );
}
