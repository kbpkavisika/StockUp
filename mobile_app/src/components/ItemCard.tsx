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
    <View className={`mb-5 self-center w-full max-w-[400px] rounded-2xl border-2 px-5 pb-5 pt-6 shadow-lg ${isDark ? 'border-slate-700 bg-slate-800 shadow-none' : 'border-slate-300 bg-white'}`}>
      <Text className={`text-center text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</Text>
      <Text className={`mt-2 text-center text-base ${isDark ? 'text-white' : 'text-slate-600'}`}>{item.description}</Text>
      
      <View className={`mt-5 w-full border-t pt-4 flex-row items-center justify-between ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
        <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-500'}`}>{item.timestamp}</Text>
        
        <View className="flex-row gap-3">
          <PrimaryButton label="Update" variant="success" onPress={() => onEdit(item)} />
          <PrimaryButton label="Delete" variant="danger" onPress={() => onDelete(item.id)} />
        </View>
      </View>
    </View>
  );
}
