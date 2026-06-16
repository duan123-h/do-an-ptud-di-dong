import { create } from "zustand";

type AuthStore = {
    returnUrl: string | null;
    setReturnUrl: (url: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    returnUrl: null,
    setReturnUrl: (url) => set({ returnUrl: url }),
}));