import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';
import ItemRow from '../components/ItemRow';
import SearchBar from '../components/SearchBar';
import TopBar from '../components/TopBar';
import { Button, Chip, IconButton, OptionRow, Text } from '../components/ui';
import { useTheme } from '../theme/ThemeContext';
import type { Item } from '../types/item';
import type { RootStackParamList } from '../types/navigation';
import { getItems, subscribeToItems } from '../utils/database';
import { SORT_OPTIONS, sortItems, type SortKey } from '../utils/sort';
import { stockStatus, type StockStatus } from '../utils/stock';

type StockFilter = 'all' | Exclude<StockStatus, 'in'>;

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  // Reload on focus, on search changes, and whenever items change (save, delete, Undo)
  useFocusEffect(
    useCallback(() => {
      const load = () => setItems(getItems(search));
      load();
      return subscribeToItems(load);
    }, [search]),
  );

  const counts = useMemo(() => {
    const result = { low: 0, out: 0 };
    items.forEach((item) => {
      const status = stockStatus(item);
      if (status !== 'in') result[status] += 1;
    });
    return result;
  }, [items]);

  const visibleItems = useMemo(
    () => sortItems(filter === 'all' ? items : items.filter((item) => stockStatus(item) === filter), sort),
    [items, filter, sort],
  );

  const openItem = (item?: Item) => navigation.navigate('ItemForm', item ? { itemId: item.id } : undefined);
  const sortLabel = SORT_OPTIONS.find((option) => option.key === sort)?.label;
  const searching = search.trim().length > 0;

  const header = (
    <View className="gap-4 px-4 pb-3 pt-6">
      <View className="gap-1">
        <Text variant="h1" accessibilityRole="header">
          Inventory
        </Text>
        <Text variant="caption">
          {searching ? plural(items.length, 'result') : plural(items.length, 'item')}
          {counts.low > 0 && ` · ${counts.low} low`}
          {counts.out > 0 && ` · ${counts.out} out of stock`}
        </Text>
      </View>
      <SearchBar value={search} onChangeText={setSearch} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2" className="-mx-4" contentContainerStyle={{ paddingHorizontal: 16 }}>
        <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
        <Chip label={`Low stock · ${counts.low}`} selected={filter === 'low'} onPress={() => setFilter(filter === 'low' ? 'all' : 'low')} />
        <Chip label={`Out of stock · ${counts.out}`} selected={filter === 'out'} onPress={() => setFilter(filter === 'out' ? 'all' : 'out')} />
        <Chip label={`Sort: ${sortLabel}`} icon="chevron" selected={sort !== 'newest'} onPress={() => setSortOpen(true)} />
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-surface">
      <TopBar
        right={
          <>
            <IconButton icon="settings" label="Settings" onPress={() => navigation.navigate('Settings')} />
            <IconButton icon="plus" label="Add item" onPress={() => openItem()} />
          </>
        }
      />

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ItemRow item={item} onPress={openItem} />}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={{ borderBottomWidth: visibleItems.length > 0 ? 1 : 0, borderColor: colors.border }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        ListEmptyComponent={
          <EmptyState
            kind={searching ? 'search' : filter !== 'all' ? 'filter' : 'empty'}
            query={search.trim()}
            onAdd={() => openItem()}
            onClear={() => {
              setSearch('');
              setFilter('all');
            }}
          />
        }
      />

      <BottomSheet visible={sortOpen} title="Sort by" onClose={() => setSortOpen(false)}>
        {SORT_OPTIONS.map((option) => (
          <OptionRow
            key={option.key}
            label={option.label}
            selected={option.key === sort}
            onPress={() => {
              setSort(option.key);
              setSortOpen(false);
            }}
          />
        ))}
      </BottomSheet>
    </View>
  );
}

function EmptyState({
  kind,
  query,
  onAdd,
  onClear,
}: {
  kind: 'empty' | 'search' | 'filter';
  query: string;
  onAdd: () => void;
  onClear: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="items-center px-16 py-16">
      <Icon name={kind === 'empty' ? 'box' : 'search'} size={24} color={colors.secondary} />
      <Text variant="h2" className="mt-4 text-center">
        {kind === 'empty' ? 'No items yet' : kind === 'search' ? `No matches for “${query}”` : 'Nothing here'}
      </Text>
      <Text variant="caption" className="mt-2 text-center">
        {kind === 'empty'
          ? 'Add your first item to start tracking stock.'
          : kind === 'search'
            ? 'Try a different name, SKU or category.'
            : 'No items match this filter.'}
      </Text>
      <View className="mt-6">
        {kind === 'empty' ? (
          <Button label="Add item" icon="plus" onPress={onAdd} />
        ) : (
          <Button label={kind === 'search' ? 'Clear search' : 'Show all items'} variant="secondary" size="md" onPress={onClear} />
        )}
      </View>
    </View>
  );
}
