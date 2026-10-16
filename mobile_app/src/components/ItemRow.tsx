import React from 'react';
import { Pressable, View } from 'react-native';
import type { Item } from '../types/item';
import { formatPrice, formatQuantity, STOCK_LABELS, stockStatus } from '../utils/stock';
import { Badge, Text } from './ui';

const STOCK_TONES = { in: 'success', low: 'warning', out: 'neutral' } as const;

/** Inventory list row: name + SKU · category on the left, quantity + stock badge on the right */
export default function ItemRow({ item, onPress }: { item: Item; onPress: (item: Item) => void }) {
  const status = stockStatus(item);
  const meta = [item.sku, item.category].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatQuantity(item.quantity)} in stock, ${STOCK_LABELS[status]}`}
      accessibilityHint="Opens the item to edit"
      onPress={() => onPress(item)}
      className="min-h-[76px] flex-row items-center gap-4 border-b border-border px-4 py-3 active:bg-surface-muted"
    >
      <View className="flex-1 gap-1">
        <Text variant="label-lg" numberOfLines={1} style={{ fontSize: 16 }}>
          {item.name}
        </Text>
        {meta ? (
          <Text variant="mono" tone="secondary" numberOfLines={1}>
            {meta}
          </Text>
        ) : item.description ? (
          <Text variant="caption" numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
        {item.price_cents !== null && (
          <Text variant="body" numberOfLines={1} style={{ fontSize: 15 }}>
            {formatPrice(item.price_cents)}
          </Text>
        )}
      </View>
      <View className="items-end gap-1.5">
        <Text variant="mono" style={{ fontSize: 17, lineHeight: 22, fontFamily: 'IBMPlexMono_500Medium' }}>
          {formatQuantity(item.quantity)}
        </Text>
        <Badge label={STOCK_LABELS[status]} tone={STOCK_TONES[status]} />
      </View>
    </Pressable>
  );
}
