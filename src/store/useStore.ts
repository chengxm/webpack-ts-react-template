import { create } from "zustand";
import {
  combine,
  devtools,
  persist,
  createJSONStorage,
} from "zustand/middleware";

export interface UserInfo {
  id: string;
  name: string;
  token: string;
}
export interface StoreState {
  themeColor: string;
  userInfo: UserInfo | null;
}
// 1. 定义初始状态 (Initial State)
const initialState: StoreState = {
  themeColor: "#1890ff",
  userInfo: null,
};

// 2. 创建 Store
export const useStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        // Actions
        setThemeColor: (color: string) => set(() => ({ themeColor: color })),
        setUserInfo: (userInfo: UserInfo) => set(() => ({ userInfo })),
      })),
      {
        // Persist 配置项 (第二个参数)
        name: "data-storage", // 存入 localStorage 的 key 名称
        storage: createJSONStorage(() => localStorage), // (可选) 默认就是 localStorage
        // partialize: (state) => ({ bears: state.themeColor }), // (可选) 只持久化 bears，不持久化 user
      },
    ),
    {
      // Devtools 配置项 (第二个参数，可选)
      name: "BearStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
