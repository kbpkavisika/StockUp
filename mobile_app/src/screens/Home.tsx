import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getItems, deleteItem, searchItems } from '../utils/database';
import { initDatabase } from '../utils/database';
import { useTheme } from '../utils/ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import ItemCard from '../components/ItemCard';
import type { Item } from '../types/item';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    initDatabase(() => {
      loadItems();
    });
  }, []);

  const loadItems = () => {
    if (search) {
      searchItems(search, setItems);
    } else {
      getItems(setItems);
    }
  };

  useEffect(() => {
    loadItems();
  }, [search]);

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => {
        deleteItem(id);
        loadItems();
      }},
    ]);
  };

  return (
    <View className={`flex-1 p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScreenHeader title="My Items" actionLabel="Theme" onAction={toggleTheme} />
      <TextInput
        className={`mb-4 rounded-xl border px-3 py-3 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-white'}`}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
      />
      <PrimaryButton label="Add New Item" onPress={() => navigation.navigate('ItemForm' as never)} />
      <FlatList
        className="mt-4"
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View className="rounded-xl border border-dashed border-slate-300 p-6">
            <Text className={`text-center ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>No items yet. Add your first item.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            isDark={isDark}
            onEdit={(selectedItem) => navigation.navigate('ItemForm', { item: selectedItem } as never)}
            onDelete={handleDelete}
          />
        )}
      />
    </View>
  );
}