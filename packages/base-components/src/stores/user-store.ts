"use client";

import { IUser } from "@znode/types/user";
import { getSavedUserSessionCallForClient } from "@znode/utils/common";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IUserStore {
  user: IUser | null;
  isUserSessionLoading: boolean;
  sessionFetched: boolean; // flag to check if session has been fetched
  loadUser: (_shouldRefresh?: boolean) => Promise<void>;
  clearUser: () => void;
}

const useUserStore = create<IUserStore>()(
  devtools<IUserStore>((set, get) => ({
    user: null as IUser | null,
    isUserSessionLoading: false,
    sessionFetched: false,
    loadUser: async (shouldRefresh = false) => {
      const { sessionFetched, isUserSessionLoading } = get();
      if (isUserSessionLoading || (sessionFetched && !shouldRefresh)) {
        return;
      }

      set({ isUserSessionLoading: true });
      try {
        const userSession = await getSavedUserSessionCallForClient();
        set({ user: userSession, sessionFetched: sessionFetched ? true : false });
      } catch (error) {
        set({ user: null, sessionFetched: false });
      } finally {
        set({ isUserSessionLoading: false });
      }
    },

    clearUser: () => set({ user: null, sessionFetched: false }),
  }))
);

export const useUser = () => useUserStore();
export default useUserStore;
