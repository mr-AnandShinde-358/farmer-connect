// src/stores/authStore.ts
// Zustand v5 store — manages client-side auth state
// Persisted via MMKV (synchronous, blazing fast)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { setAuthFailureListener } from '../api/axiosInstance';
import { tokenStorage, userStorage } from '../storage/mmkvStorage';
import { queryClient } from '../utils/queryClient';
// import type { User, AuthTokens } from '../types/auth';


import { AuthTokens, User } from '../types/auth.types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // true after reading MMKV on startup

  // Actions
  hydrate: () => void;
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
}

// ──────────────────────────────────────────────
// Zustand Store with subscribeWithSelector
// ──────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    // ── Initial State ──────────────────────────
    user: null,
    isAuthenticated: false,
    isHydrated: false,

    // ── Hydrate: read persisted state from MMKV ──
    hydrate: () => {
      const hasTokens = tokenStorage.hasTokens();
      // const isExpired = tokenStorage.isTokenExpired();
      const user = userStorage.getUser<User>();


      if (hasTokens && user) { // && !isExpired 
        set({ user, isAuthenticated: true, isHydrated: true });
      } else {
        // Tokens expired or missing — clear everything
        tokenStorage.clearTokens();
        userStorage.clearUser();
        set({ user: null, isAuthenticated: false, isHydrated: true });
      }
    },

    // ── Set Auth: called after successful login/register ──
    setAuth: (user: User, tokens: AuthTokens) => {
      tokenStorage.setTokens(
        tokens.accessToken,
        tokens.refreshToken,
        // tokens.expiresIn,
      );
      userStorage.setUser(user);
      set({ user, isAuthenticated: true });
    },

    // ── Clear Auth: called on logout or 401 failure ──
    clearAuth: () => {
      tokenStorage.clearTokens();
      userStorage.clearUser();

      // Clear all cached queries
      queryClient.clear();

      set({ user: null, isAuthenticated: false });
    },

    // ── Update user profile without touching tokens ──
    setUser: (user: User) => {
      userStorage.setUser(user);
      set({ user });
    },

  })),
);

// ──────────────────────────────────────────────
// Register Axios 401 Listener → auto logout
// ──────────────────────────────────────────────
setAuthFailureListener(() => {
  useAuthStore.getState().clearAuth();
});

// ──────────────────────────────────────────────
// Convenience selectors (avoids re-renders)
// ──────────────────────────────────────────────
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsHydrated = (state: AuthState) => state.isHydrated;