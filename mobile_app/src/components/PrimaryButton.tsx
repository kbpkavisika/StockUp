import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

const variantClass = {
  primary: 'bg-blue-600',
  secondary: 'bg-slate-500',
  danger: 'bg-red-600',
  success: 'bg-green-600',
};

export default function PrimaryButton({ label, onPress, variant = 'primary' }: PrimaryButtonProps) {
  return (
    <TouchableOpacity className={`rounded-xl px-6 py-3 shadow-lg ${variantClass[variant]}`} onPress={onPress}>
      <Text className="text-center font-bold text-white text-base">{label}</Text>
    </TouchableOpacity>
  );
}
