import type { Item } from './item';

export type RootStackParamList = {
  Home: undefined;
  ItemForm: { item?: Item } | undefined;
};
