import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Logo from './Logo';
import { Text, IconButton } from './ui';

/**
 * Top bar — DESIGN.md §07. Root screens show the wordmark left-aligned; sub-screens show a back
 * chevron and a centred title. Separated from content by a 1px hairline, never a shadow.
 */
export default function TopBar({
  title,
  subtitle,
  onBack,
  right,
}: {
  /** Omit on root screens to show the wordmark */
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View className="border-b border-border bg-surface" style={{ paddingTop: insets.top }}>
      <View className="h-14 flex-row items-center px-2">
        {onBack ? (
          <IconButton icon="back" label="Back" onPress={onBack} />
        ) : (
          <View accessible accessibilityRole="header" accessibilityLabel="StockUp" className="flex-row items-center gap-2 px-2">
            <Logo size={24} color={colors.primary} />
            <Text style={{ fontFamily: 'Archivo_800ExtraBold', fontSize: 22, letterSpacing: -0.66 }}>stockup</Text>
          </View>
        )}

        {title ? (
          <View className="flex-1 items-center px-2">
            <Text variant="label-lg" accessibilityRole="header" numberOfLines={1} style={{ fontSize: 17, lineHeight: 22 }}>
              {title}
            </Text>
            {subtitle && (
              <Text variant="caption" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        ) : (
          <View className="flex-1" />
        )}

        {/* Keeps the title centred when only one side has a control */}
        <View className="min-w-11 flex-row items-center justify-end">{right}</View>
      </View>
    </View>
  );
}
