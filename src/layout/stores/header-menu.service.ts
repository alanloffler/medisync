import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type States = {
  headerMenuSelected: number;
};

type Actions = {
  setHeaderMenuSelected: (headerMenu: number) => void;
};

const initialState: States = {
  headerMenuSelected: 0,
};

export const useHeaderMenuStore = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setHeaderMenuSelected: (item) => set({ headerMenuSelected: item }),
    }),
    {
      name: 'header-menu',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
