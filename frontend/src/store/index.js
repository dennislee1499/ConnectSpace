import { create } from "zustand";
import { createAuthState } from "./state/auth-state";

export const useAppStore = create((set) => ({
    ...createAuthState(set), 
})); 