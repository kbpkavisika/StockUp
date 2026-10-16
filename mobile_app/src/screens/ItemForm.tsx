import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmSheet } from '../components/BottomSheet';
import { useToast } from '../components/Toast';
import TopBar from '../components/TopBar';
import { Button, Chip, IconButton, TextField } from '../components/ui';
import type { Item, ItemInput } from '../types/item';
import type { RootStackParamList } from '../types/navigation';
import { addItem, deleteItem, getCategories, getItem, isSkuTaken, restoreItem, updateItem } from '../utils/database';
import { parseCount, parsePrice, priceToInput } from '../utils/stock';

type FormValues = {
  name: string;
  sku: string;
  category: string;
  quantity: string;
  lowStockThreshold: string;
  price: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const DEFAULT_LOW_STOCK = 5;
const WHOLE_NUMBER = 'Enter a whole number, 0 or more';

const initialValues = (item: Item | null): FormValues => ({
  name: item?.name ?? '',
  sku: item?.sku ?? '',
  category: item?.category ?? '',
  quantity: item ? String(item.quantity) : '0',
  lowStockThreshold: String(item?.low_stock_threshold ?? DEFAULT_LOW_STOCK),
  price: priceToInput(item?.price_cents ?? null),
  description: item?.description ?? '',
});

/** Same rules as the desktop form (desktop_app/src/frontend/components/ItemForm.tsx) */
const validate = (values: FormValues, itemId?: number): { input: ItemInput } | { errors: FormErrors } => {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const sku = values.sku.trim();
  const quantity = parseCount(values.quantity);
  const lowStockThreshold = parseCount(values.lowStockThreshold);
  const priceCents = parsePrice(values.price);

  if (!name) errors.name = 'Name is required';
  if (sku && isSkuTaken(sku, itemId)) errors.sku = 'Another item already uses this SKU';
  if (quantity === undefined) errors.quantity = WHOLE_NUMBER;
  if (lowStockThreshold === undefined) errors.lowStockThreshold = WHOLE_NUMBER;
  if (priceCents === undefined) errors.price = 'Enter a price like 12.50';

  if (Object.keys(errors).length > 0 || quantity === undefined || lowStockThreshold === undefined || priceCents === undefined) {
    return { errors };
  }
  return {
    input: {
      name,
      description: values.description.trim(),
      sku: sku || null,
      quantity,
      priceCents,
      category: values.category.trim() || null,
      lowStockThreshold,
    },
  };
};

export default function ItemForm() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemForm'>>();
  const insets = useSafeAreaInsets();
  const showToast = useToast();

  const itemId = route.params?.itemId;
  const [item] = useState(() => (itemId === undefined ? null : getItem(itemId)));
  const [initial] = useState(() => initialValues(item));
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories] = useState(getCategories);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const nameRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const dirty = (Object.keys(values) as (keyof FormValues)[]).some((key) => values[key] !== initial[key]);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  // Ask before throwing away edits (back button, swipe back, hardware back)
  useEffect(() => {
    if (!dirty || saved) return;
    return navigation.addListener('beforeRemove', (event) => {
      event.preventDefault();
      setPendingLeave(() => () => navigation.dispatch(event.data.action));
    });
  }, [navigation, dirty, saved]);

  const update = (key: keyof FormValues) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const stepQuantity = (delta: number) => {
    const current = parseCount(values.quantity) ?? 0;
    update('quantity')(String(Math.max(0, current + delta)));
  };

  const save = () => {
    const result = validate(values, item?.id);
    if ('errors' in result) {
      setErrors(result.errors);
      if (result.errors.name) nameRef.current?.focus();
      return;
    }
    try {
      if (item) updateItem(item.id, result.input);
      else addItem(result.input);
    } catch (error) {
      showToast(`Couldn't save: ${(error as Error).message}`);
      return;
    }
    setSaved(true);
    showToast(item ? 'Changes saved' : 'Item added');
    // Let the saved flag reach usePreventRemove before leaving
    requestAnimationFrame(() => navigation.goBack());
  };

  const remove = () => {
    if (!item) return;
    setConfirmDelete(false);
    deleteItem(item.id);
    setSaved(true);
    showToast('Item deleted', { label: 'Undo', onPress: () => restoreItem(item) });
    requestAnimationFrame(() => navigation.goBack());
  };

  const matchingCategories = categories.filter(
    (category) => category.toLowerCase().includes(values.category.trim().toLowerCase()) && category !== values.category.trim(),
  );

  return (
    <View className="flex-1 bg-surface">
      <TopBar title={item ? 'Edit item' : 'Add item'} subtitle={item?.sku ?? undefined} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-5 px-4 pt-6 pb-8">
          <TextField
            inputRef={nameRef}
            label="Name"
            required
            error={errors.name}
            placeholder="e.g. Blue hoodie"
            value={values.name}
            onChangeText={update('name')}
            autoCapitalize="sentences"
            returnKeyType="next"
          />

          <TextField
            label="SKU"
            error={errors.sku}
            mono
            placeholder="e.g. HD-BLU-M"
            autoCapitalize="characters"
            autoCorrect={false}
            spellCheck={false}
            value={values.sku}
            onChangeText={update('sku')}
          />

          <View>
            <TextField label="Category" placeholder="e.g. Apparel" value={values.category} onChangeText={update('category')} />
            {matchingCategories.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" className="mt-2" contentContainerClassName="gap-2">
                {matchingCategories.map((category) => (
                  <Chip key={category} label={category} onPress={() => update('category')(category)} />
                ))}
              </ScrollView>
            )}
          </View>

          <TextField
            label="Quantity"
            error={errors.quantity}
            mono
            keyboardType="number-pad"
            value={values.quantity}
            onChangeText={update('quantity')}
            right={
              <View className="flex-row pr-1">
                <IconButton icon="minus" label="Decrease quantity" onPress={() => stepQuantity(-1)} />
                <IconButton icon="plus" label="Increase quantity" onPress={() => stepQuantity(1)} />
              </View>
            }
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField
                label="Low stock at"
                error={errors.lowStockThreshold}
                hint="Flags the item at or below this"
                mono
                keyboardType="number-pad"
                value={values.lowStockThreshold}
                onChangeText={update('lowStockThreshold')}
              />
            </View>
            <View className="flex-1">
              <TextField
                label="Unit price"
                error={errors.price}
                mono
                keyboardType="decimal-pad"
                placeholder="0.00"
                value={values.price}
                onChangeText={update('price')}
              />
            </View>
          </View>

          <TextField
            label="Description"
            multiline
            placeholder="Size, colour, supplier, notes…"
            value={values.description}
            onChangeText={update('description')}
          />

          {item && (
            <View className="mt-3 items-start border-t border-border pt-6">
              <Button label="Delete item" variant="destructive" size="md" icon="delete" onPress={() => setConfirmDelete(true)} />
            </View>
          )}
        </ScrollView>

        <View className="border-t border-border bg-surface px-4 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          <Button label={item ? 'Save changes' : 'Add item'} onPress={save} />
        </View>
      </KeyboardAvoidingView>

      <ConfirmSheet
        visible={confirmDelete}
        title={`Delete “${item?.name ?? ''}”?`}
        body="This removes it from your inventory. You can undo right after."
        confirmLabel="Delete item"
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmSheet
        visible={pendingLeave !== null}
        title="Discard changes?"
        body={item ? "Your edits to this item won't be saved." : "This item won't be added."}
        confirmLabel="Discard"
        onConfirm={() => {
          const leave = pendingLeave;
          setPendingLeave(null);
          leave?.();
        }}
        onCancel={() => setPendingLeave(null)}
      />
    </View>
  );
}
