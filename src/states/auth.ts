import { GlobalState } from "@/global-state";
import { useMemo } from "react";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  username: string;
  email: string;
};
type AuthState = { user: User | null; setUser: (user: User) => void; resetUser: VoidFunction };

export namespace AuthState {
  const store = GlobalState.create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        setUser: (user: User) => set({ user }),
        resetUser: () => set(() => ({ user: null })),
      }),
      { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
    )
  );

  export const use = store;
  export const get = store.getState;
}

/**
 * User namespace
 *
 * This namespace handles user-related actions such as updating user details,
 * accessing the current user data, and logging out the user.
 */
export namespace User {
  export const updateUser = (user: User) => {
    const { setUser } = AuthState.get();
    setUser(user);
  };

  export const useUser = () => {
    const { user } = AuthState.get();
    return useMemo(() => ({ ...user }), [user]);
  };

  export const logOut = () => {
    const { resetUser } = AuthState.get();
    resetUser();
  };
}
