import React, { useState } from 'react';
import { Pressable, Text as RNText, TextInput, View, type PressableProps, type TextInputProps, type TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fonts, typography, type TypographyVariant } from '../theme/tokens';
import Icon, { type IconName } from './Icon';

/* ---------- Text — DESIGN.md §02 ---------- */

type Tone = 'primary' | 'secondary' | 'disabled' | 'accent' | 'error' | 'success' | 'warning' | 'on-primary' | 'white';

const toneClass: Record<Tone, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  disabled: 'text-disabled',
  accent: 'text-accent-pressed',
  error: 'text-error',
  success: 'text-success',
  warning: 'text-warning',
  'on-primary': 'text-on-primary',
  white: 'text-white',
};

const defaultTone: Partial<Record<TypographyVariant, Tone>> = {
  caption: 'secondary',
  overline: 'accent',
};

export function Text({
  variant = 'body',
  tone,
  className = '',
  style,
  ...props
}: TextProps & { variant?: TypographyVariant; tone?: Tone; className?: string }) {
  return (
    <RNText
      className={`${toneClass[tone ?? defaultTone[variant] ?? 'primary']} ${className}`}
      style={[typography[variant], style]}
      {...props}
    />
  );
}

/* ---------- Buttons — DESIGN.md §06 ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'destructive';
type ButtonSize = 'lg' | 'md' | 'sm';

const buttonHeights: Record<ButtonSize, string> = { lg: 'h-[52px] px-6', md: 'h-11 px-6', sm: 'h-9 px-4' };

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled = false,
  className = '',
  onPress,
}: {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  className?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState(false);

  const surface = disabled
    ? variant === 'secondary'
      ? 'bg-surface border-[1.5px] border-border-disabled'
      : 'bg-border'
    : {
        primary: pressed ? 'bg-primary-hover' : 'bg-primary',
        secondary: `border-[1.5px] border-primary ${pressed ? 'bg-surface-sunken' : 'bg-surface'}`,
        destructive: pressed ? 'bg-danger-pressed' : 'bg-danger',
      }[variant];
  const tone: Tone = disabled ? 'disabled' : variant === 'primary' ? 'on-primary' : variant === 'destructive' ? 'white' : 'primary';
  const iconColor = disabled ? colors.disabled : variant === 'primary' ? colors['on-primary'] : variant === 'destructive' ? '#FFFFFF' : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={`flex-row items-center justify-center gap-2 rounded-full ${buttonHeights[size]} ${surface} ${className}`}
      style={{ transform: [{ scale: pressed && variant === 'primary' ? 0.97 : 1 }] }}
    >
      {icon && <Icon name={icon} size={20} color={iconColor} />}
      <Text variant={size === 'sm' ? 'label-sm' : 'label-lg'} tone={tone}>
        {label}
      </Text>
    </Pressable>
  );
}

/** 44×44 icon-only button; always has an accessibility label */
export function IconButton({
  icon,
  label,
  onPress,
  color,
  className = '',
  ...props
}: Omit<PressableProps, 'children'> & { icon: IconName; label: string; color?: string; className?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={onPress}
      className={`h-11 w-11 items-center justify-center rounded-full active:bg-surface-sunken ${className}`}
      {...props}
    >
      <Icon name={icon} size={24} color={color ?? colors.primary} />
    </Pressable>
  );
}

/** Text link — 15/600 with a 1.5px underline */
export function TextLink({ label, onPress, tone = 'primary' }: { label: string; onPress: () => void; tone?: Tone }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8} className="active:opacity-60">
      <Text variant="label-lg" tone={tone} style={{ textDecorationLine: 'underline' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Filter chip — DESIGN.md §06 ---------- */

export function Chip({
  label,
  selected = false,
  icon,
  onPress,
}: {
  label: string;
  selected?: boolean;
  icon?: IconName;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`h-11 flex-row items-center gap-1.5 rounded-md px-4 ${
        selected ? 'border-[1.5px] border-primary bg-surface-sunken' : 'border border-border-strong bg-surface active:bg-surface-sunken'
      }`}
    >
      <Text variant="body" style={{ fontFamily: selected ? fonts.semibold : fonts.medium }}>
        {label}
      </Text>
      {icon && <Icon name={icon} size={20} color={colors.primary} />}
    </Pressable>
  );
}

/** Selectable row in a sheet or dropdown — selected shows ✓ in accent-pressed (DESIGN.md §06 Dropdown panel) */
export function OptionRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      className="-mx-2 h-12 flex-row items-center justify-between rounded-md px-2 active:bg-surface-muted"
    >
      <Text variant="body" style={selected ? { fontFamily: fonts.semibold } : undefined}>
        {label}
      </Text>
      {selected && <Icon name="check" size={20} color={colors['accent-pressed']} />}
    </Pressable>
  );
}

/* ---------- Badge — DESIGN.md §06 ---------- */

const badgeTones = {
  success: { box: 'bg-success-tint', tone: 'success' as Tone },
  warning: { box: 'bg-warning-tint', tone: 'warning' as Tone },
  neutral: { box: 'bg-surface-sunken', tone: 'secondary' as Tone },
};

export function Badge({ label, tone }: { label: string; tone: keyof typeof badgeTones }) {
  return (
    <View className={`h-6 justify-center rounded-sm px-2 ${badgeTones[tone].box}`}>
      <Text variant="overline" tone={badgeTones[tone].tone} style={{ letterSpacing: 0.66 }}>
        {label}
      </Text>
    </View>
  );
}

/* ---------- Text field — DESIGN.md §06 Inputs ---------- */

export function TextField({
  label,
  required = false,
  error,
  hint,
  mono = false,
  multiline = false,
  right,
  inputRef,
  ...props
}: TextInputProps & {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  mono?: boolean;
  /** Replaces the trailing slot, e.g. a quantity stepper */
  right?: React.ReactNode;
  inputRef?: React.Ref<React.ComponentRef<typeof TextInput>>;
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const border = error ? 'border-[1.5px] border-error' : focused ? 'border-[1.5px] border-primary' : 'border border-border-strong';

  return (
    <View>
      <View className="mb-2 flex-row items-baseline gap-2">
        <Text variant="label-lg" tone={error ? 'error' : 'primary'}>
          {label}
        </Text>
        {required && <Text variant="body" tone="secondary">Required</Text>}
      </View>
      <View className={`flex-row items-center rounded-md bg-surface ${multiline ? 'min-h-[112px]' : 'h-[52px]'} ${border}`}>
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          placeholderTextColor={colors.secondary}
          selectionColor={colors.info}
          cursorColor={colors.info}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          className="flex-1 px-4 text-primary"
          style={[mono ? typography.mono : typography.body, { fontSize: 15, lineHeight: undefined }, multiline && { paddingVertical: 14, minHeight: 110 }]}
          {...props}
        />
        {right}
      </View>
      {error ? (
        <Text variant="caption" tone="error" className="mt-1.5">
          {error}
        </Text>
      ) : (
        hint && (
          <Text variant="caption" className="mt-1.5">
            {hint}
          </Text>
        )
      )}
    </View>
  );
}

/* ---------- Divider ---------- */

export function Divider({ label }: { label?: string }) {
  if (!label) return <View className="my-6 h-px bg-border" />;
  return (
    <View className="my-6 flex-row items-center gap-3">
      <View className="h-px flex-1 bg-border" />
      <Text variant="overline" tone="secondary">
        {label}
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
