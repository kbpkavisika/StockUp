import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { Easing, FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text } from './ui';

const enter = SlideInDown.duration(240).easing(Easing.bezier(0.2, 0, 0, 1));

/** Bottom sheet — DESIGN.md §06 Modal / bottom sheet: 16 top radius, 40×4 grabber, 45% ink scrim */
export default function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(160)} className="flex-1 justify-end" style={{ backgroundColor: 'rgba(16,17,18,0.45)' }}>
        <Pressable accessibilityLabel="Close" className="flex-1" onPress={onClose} />
        <Animated.View
          entering={enter}
          accessibilityViewIsModal
          className="rounded-t-xl bg-surface px-5 pt-3"
          style={{ paddingBottom: insets.bottom + 20, boxShadow: '0 -16px 40px rgba(16,17,18,0.16)' }}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-border-disabled" />
          <Text variant="h2" accessibilityRole="header" className="mb-4">
            {title}
          </Text>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/** Destructive confirmation — the one place a red fill is allowed */
export function ConfirmSheet({
  visible,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <BottomSheet visible={visible} title={title} onClose={onCancel}>
      <Text variant="body" className="mb-6">
        {body}
      </Text>
      <View className="gap-3">
        <Button label={confirmLabel} variant="destructive" onPress={onConfirm} />
        <Button label="Cancel" variant="secondary" onPress={onCancel} />
      </View>
    </BottomSheet>
  );
}
