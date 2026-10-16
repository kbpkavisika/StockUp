import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from './Icon';
import { Text } from './ui';

interface ToastAction {
  label: string;
  onPress: () => void;
}

interface ToastData {
  id: number;
  message: string;
  action?: ToastAction;
}

const TOAST_DURATION = 4000;

const ToastContext = createContext<(message: string, action?: ToastAction) => void>(() => {});

export const useToast = () => useContext(ToastContext);

/** One toast at a time, 4s, bottom of the screen — DESIGN.md §08 Error / toasts */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const nextId = useRef(0);

  const show = useCallback((message: string, action?: ToastAction) => {
    nextId.current += 1;
    setToast({ id: nextId.current, message, action });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <ToastView key={toast.id} toast={toast} onDismiss={dismiss} />}
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      exiting={FadeOut.duration(120)}
      accessibilityLiveRegion="polite"
      className="absolute left-4 right-4 flex-row items-center gap-3 rounded-lg bg-primary py-2 pl-4 pr-2"
      style={{ bottom: insets.bottom + 16, boxShadow: '0 8px 24px rgba(16,17,18,0.10)' }}
    >
      <Text variant="body" tone="on-primary" className="flex-1 py-2.5">
        {toast.message}
      </Text>
      {toast.action && (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            toast.action?.onPress();
            onDismiss();
          }}
          className="h-11 justify-center px-2"
        >
          <Text variant="label-lg" tone="on-primary" style={{ textDecorationLine: 'underline' }}>
            {toast.action.label}
          </Text>
        </Pressable>
      )}
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDismiss} className="h-11 w-11 items-center justify-center">
        <View style={{ opacity: 0.7 }}>
          <Icon name="close" size={20} color={colors['on-primary']} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
