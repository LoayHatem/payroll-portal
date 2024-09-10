import { create } from "zustand";
import { api } from "../api/api";
import type { DashboardStats } from "@/api/endpoints/dashboardEndpoint";

interface DashboardStore {
  stats: DashboardStats | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  fetchStats: async () => {
    const { stats } = await api.dashboard.getStats();
    set({ stats });
  },
}));
