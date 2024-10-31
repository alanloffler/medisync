import { create } from 'zustand';
import { format } from '@formkit/tempo';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface INotification {
  date?: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

type States = {
  notifications: INotification[];
};

type Actions = {
  addNotification: (notification: INotification) => void;
  reset: () => void;
};

const initialState: States = {
  notifications: [],
};

export const useNotificationsStore = create<States & Actions>()(
  persist(
    (set) => ({
      notifications: initialState.notifications,
      addNotification: (notification: INotification) => {
        const nd = new Date();
        notification.date = format(nd, 'HH:mm:ss');
        set((state) => ({ notifications: [notification, ...state.notifications]}));
      },
      reset: () => set(initialState),
    }),
    {
      name: 'notifications',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
