import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type States = {
  help: boolean;
};

type Actions = {
  setHelp: (help: boolean) => void;
};

const initialState: States = {
  help: false,
};

export const useHelpStore = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setHelp: (help: boolean) => set({ help }),
    }),
    {
      name: 'help',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
