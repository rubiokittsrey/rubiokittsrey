import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userSchema, type User } from '@/lib/auth/schemas';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: unknown) => void;
    clearUser: () => void;
    isAdmin: () => boolean;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isLoading: true,

                setUser: (rawUser) => {
                    try {
                        const user = userSchema.parse(rawUser);
                        set({ user, isLoading: false });
                    } catch (error) {
                        console.error('Invalid user data:', error);
                        set({ user: null, isLoading: false });
                    }
                },

                clearUser: () => set({ user: null, isLoading: false }),

                isAdmin: () => get().user?.role === 'admin',

                isAuthenticated: () => get().user !== null,
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({ user: state.user }),
            }
        )
    )
);
