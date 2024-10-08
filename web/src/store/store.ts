import { create } from "zustand"

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  profileUrl?: string;
  images?: string[]
  planId?: string
  isOAuth: boolean
}

interface Store {
  user: User | undefined;
  setUser: (user: User | undefined) => void
}

export const useStore = create<Store>((set) => ({
  user: undefined,
  setUser: (user) => set({ user })
}))