import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type States = {
  navMenuExpanded: boolean;
  navMenuSelected: number;
};

type Actions = {
  setNavMenuExpanded: (state: boolean) => void;
  setNavMenuSelected: (navMenu: number) => void;
};

const initialState: States = {
  navMenuExpanded: false,
  navMenuSelected: 0,
};

export const useNavMenuStore = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setNavMenuSelected: (item) => set({ navMenuSelected: item }),
      setNavMenuExpanded: (state) => set({ navMenuExpanded: state }),
    }),
    {
      name: 'nav-menu',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
