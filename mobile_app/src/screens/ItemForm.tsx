import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { addItem, initializeDatabase, updateItem } from '../utils/database';
import { useTheme } from '../utils/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';
import type { RootStackParamList } from '../types/navigation';

export default function ItemForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemForm'>>();
  const item = route.params?.item;
  const { isDark } = useTheme();

  useEffect(() => {
    initializeDatabase();

    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      return;
    }

    setTitle('');
    setDescription('');
  }, [item]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }

    if (item) {
      updateItem(item.id, title, description);
    } else {
      addItem(title, description);
    }
    navigation.goBack();
  };

  return (
    <View className={`flex-1 p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TextInput
        className={`mb-4 rounded-xl border px-4 py-3 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
      />
      <TextInput
        className={`mb-5 min-h-[120px] rounded-xl border px-4 py-3 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
      />
      <PrimaryButton label={item ? 'Update Item' : 'Save Item'} onPress={handleSave} />
    </View>
  );
}