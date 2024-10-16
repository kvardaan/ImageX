import { Image } from "@/lib/types/image"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  profileUrl?: string
  planId?: string
}

// export interface Image {
//   id: number;
//   imageUrl: string | null;
//   metadata: JSON | null;
//   userId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

interface ApplicationState {
  user: User | null
  images: Image[]
  setUser: (user: User | null) => void
  updateUser: (user: Partial<User>) => void
  setImages: (images: Image[]) => void
  addImage: (image: Image) => void
  deleteImage: (id: number) => void
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      user: null,
      images: [],

      setUser: (user) => set({ user }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setImages: (images) => set({ images }),

      addImage: (image) =>
        set((state) => ({
          images: { ...state.images, image }
        })),


      deleteImage: (id) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id)
        }))
    }),
    {
      name: "application-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        images: state.images,
      }),
    }
  )
)
