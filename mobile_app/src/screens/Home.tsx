import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { deleteItem, getItems, initializeDatabase } from '../utils/database';
import { useTheme } from '../utils/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';
import ItemCard from '../components/ItemCard';
import type { Item } from '../types/item';
import type { RootStackParamList } from '../types/navigation';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark, toggleTheme } = useTheme();

  const loadItems = useCallback(() => {
    setItems(getItems(search));
  }, [search]);

  useEffect(() => {
    initializeDatabase();
    loadItems();
  }, [loadItems]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteItem(id);
          loadItems();
        },
      },
    ]);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} className={`rounded-full px-3 py-1.5 ${isDark ? 'bg-slate-700' : 'bg-blue-500'}`}>
          <Text className="font-semibold text-white text-xs">{isDark ? 'Light' : 'Dark'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDark, toggleTheme]);

  return (
    <View className={`flex-1 p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TextInput
        className={`mb-4 rounded-xl border px-4 py-3 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
      />
      <PrimaryButton label="Add New Item" onPress={() => navigation.navigate('ItemForm')} />
      <FlatList
        className="mt-4"
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View className="self-center mt-10 w-full max-w-[400px] rounded-2xl border-2 border-dashed border-slate-300 p-8">
            <Text className={`text-center text-base font-semibold ${isDark ? 'text-white' : 'text-slate-500'}`}>No items yet. Add your first item.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            isDark={isDark}
            onEdit={(selectedItem) => navigation.navigate('ItemForm', { item: selectedItem })}
            onDelete={handleDelete}
          />
        )}
      />
    </View>
  );
}