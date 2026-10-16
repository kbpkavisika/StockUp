import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/tokens';
import Icon from './Icon';
import { Text } from './ui';

/** Search pill — DESIGN.md §06 Inputs (rest: sunken fill, no border; active: surface + 1.5px ink border) */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search items',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={`h-[52px] flex-row items-center gap-3 rounded-full pl-4 pr-2 ${
        focused ? 'border-[1.5px] border-primary bg-surface' : 'border-[1.5px] border-transparent bg-surface-sunken'
      }`}
    >
      <Icon name="search" size={20} color={colors.secondary} />
      <TextInput
        accessibilityLabel="Search items"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        selectionColor={colors.info}
        cursorColor={colors.info}
        returnKeyType="search"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-full flex-1 text-primary"
        style={[typography.body, { lineHeight: undefined }]}
      />
      {value.length > 0 && (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChangeText('')} hitSlop={8} className="h-11 justify-center px-2">
          <Text variant="label-sm" tone="secondary">
            Clear
          </Text>
        </Pressable>
      )}
    </View>
  );
}
