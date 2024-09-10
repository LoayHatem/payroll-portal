import { create } from "zustand";
import { api } from "../api/api";
import type { IProfile } from "@/types/user.types";

interface UserStore {
  profile: IProfile | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
  setProfile: (profile: IProfile) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  fetchProfile: async () => {
    const profile = await api.user.getMyProfile();
    if (profile) {
      set({ profile });
    }
  },
  clearProfile: () => set({ profile: null }),
  setProfile: (profile: IProfile) => set({ profile }),
}));
