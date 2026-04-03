import React from 'react';
import { Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';

interface ScreenHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ScreenHeader({ title, actionLabel, onAction }: ScreenHeaderProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">{title}</Text>
      {actionLabel && onAction ? (
        <View className="w-36">
          <PrimaryButton label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
