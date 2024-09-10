import { create } from "zustand";
import { api } from "../api/api";
import type { IUser } from "@/types/user.types";

interface AuthStore {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email, password) => {
    const { user } = await api.auth.login(email, password);
    set({ user });
  },
  signup: async (email, password) => {
    const { profile } = await api.auth.signUp(email, password);
    set({ user: profile });
  },
  logout: async () => {
    await api.auth.logout();
    set({ user: null });
  },
}));
