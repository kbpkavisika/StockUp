import React from 'react';
import { Text, View } from 'react-native';
import type { Item } from '../types/item';
import PrimaryButton from './PrimaryButton';

interface ItemCardProps {
  item: Item;
  isDark: boolean;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export default function ItemCard({ item, isDark, onEdit, onDelete }: ItemCardProps) {
  return (
    <View className={`mb-3 rounded-xl border p-3 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
      <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</Text>
      <Text className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.description}</Text>
      <Text className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.timestamp}</Text>
      <View className="mt-3 flex-row gap-2">
        <View className="flex-1">
          <PrimaryButton label="Edit" variant="success" onPress={() => onEdit(item)} />
        </View>
        <View className="flex-1">
          <PrimaryButton label="Delete" variant="danger" onPress={() => onDelete(item.id)} />
        </View>
      </View>
    </View>
  );
}
