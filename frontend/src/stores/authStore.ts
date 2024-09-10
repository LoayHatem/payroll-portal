import { create } from "zustand";
import { api } from "../api/api";
import { useUserStore } from "./userStore";

interface AuthStore {
  isAuthenticated: boolean;
  validateToken: () => Promise<boolean>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  validateToken: async () => {
    const { valid } = await api.auth.validateToken();
    if (valid) {
      set({ isAuthenticated: true });
      return true;
    }
    set({ isAuthenticated: false });
    return false;
  },
  login: async (credentials) => {
    await api.auth.login(credentials.email, credentials.password);
    set({ isAuthenticated: true });
    await useUserStore.getState().fetchProfile();
  },
  signup: async (userData) => {
    const { profile, errorMessage } = await api.auth.signUp(userData.email, userData.password, userData.name);
    if (errorMessage) {
      console.error(errorMessage);
    }
    if (profile) {
      set({ isAuthenticated: true });
      useUserStore.getState().setProfile(profile);
    }
  },
  logout: async () => {
    await api.auth.logout();
    set({ isAuthenticated: false });
    useUserStore.getState().clearProfile();
  },
}));
