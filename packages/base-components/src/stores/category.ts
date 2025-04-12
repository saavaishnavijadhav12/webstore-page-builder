"use client";

import { IMegaMenuCategory } from "@znode/types/category";
import { create } from "zustand";
import { getWebstoreCategory } from "../http-request/category";

interface CategoryStore {
  category: IMegaMenuCategory[];
  loading: boolean;
  isUserLoggedIn: boolean;
  setCategory: (_data: IMegaMenuCategory[]) => void;
  setUserLoggedIn: (_data: boolean) => void;
  fetchCategories: () => Promise<void>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  category: [],
  loading: false,
  isUserLoggedIn: false,
  setCategory: (_data) =>
    set(() => ({
      category: _data,
    })),
  setUserLoggedIn: (_status) =>
    set(() => ({
      isUserLoggedIn: _status,
    })),
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const categoryData = await getWebstoreCategory();
      set({ category: categoryData?.data?.categories || [], loading: false });
      set({isUserLoggedIn: categoryData?.data?.isUserLoggedIn || false});
    } catch (_error) {
      set({ loading: false });
    }
  },
}));

export const useCategoryDetails = () => useCategoryStore();
