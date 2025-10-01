import { create } from 'zustand';

export interface EditedItem {
  name: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
}

interface QuoteState {
  // Raw products parsed from OCR
  products: any[];
  // Map of item name -> edited details
  editedItems: Record<string, EditedItem>;
  setProducts: (products: any[]) => void;
  upsertEditedItem: (item: EditedItem) => void;
  reset: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  products: [],
  editedItems: {},
  setProducts: (products) => set({ products }),
  upsertEditedItem: (item) =>
    set((state) => ({
      editedItems: { ...state.editedItems, [item.name]: item },
    })),
  reset: () => set({ products: [], editedItems: {} }),
}));


