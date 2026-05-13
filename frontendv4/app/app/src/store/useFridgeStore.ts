import { create } from 'zustand';
import type { Fridge } from '../data/fridges';
import { apiClient } from '../api/api';

type FridgeState = {
  fridges: Fridge[];
  loading: boolean;
  fetchFridges: () => Promise<void>;
};

export const useFridgeStore = create<FridgeState>((set) => ({
  fridges: [],
  loading: false,
  fetchFridges: async () => {
    set({ loading: true });
    try {
      const fridges = await apiClient.getFridges();
      set({ fridges, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
