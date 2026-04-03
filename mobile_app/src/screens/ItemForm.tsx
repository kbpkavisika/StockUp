import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addItem, updateItem } from '../utils/database';
import { useTheme } from '../utils/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';

export default function ItemForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const item = route.params?.item;
  const { isDark } = useTheme();

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      updateItem(item.id, title, description);
    } else {
      addItem(title, description);
    }
    navigation.goBack();
  };

  return (
    <View className={`flex-1 p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Text className={`mb-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item ? 'Edit Item' : 'Create Item'}</Text>
      <TextInput
        className={`mb-4 rounded-xl border px-3 py-3 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-white'}`}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
      />
      <TextInput
        className={`mb-4 rounded-xl border px-3 py-3 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-white'}`}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
      />
      <PrimaryButton label={item ? 'Update Item' : 'Save Item'} onPress={handleSave} />
    </View>
  );
}