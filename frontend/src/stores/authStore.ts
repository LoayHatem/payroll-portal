import { create } from "zustand";
import { api } from "../api/api";
import type { IUser } from "@/types/user.types";

interface AuthStore {
  user: IUser | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (credentials) => {
    const { user } = await api.auth.login(credentials.email, credentials.password);
    set({ user });
  },
  signup: async (userData) => {
    const { profile } = await api.auth.signUp(userData.email, userData.password, userData.name);
    set({ user: profile });
  },
  logout: async () => {
    await api.auth.logout();
    set({ user: null });
  },
}));
