import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type States = {
  navMenuSelected: number;
};

type Actions = {
  setNavMenuSelected: (navMenu: number) => void;
};

const initialState: States = {
  navMenuSelected: 0,
};

export const useNavMenuStore = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setNavMenuSelected: (item) => set({ navMenuSelected: item }),
    }),
    {
      name: 'nav-menu',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
