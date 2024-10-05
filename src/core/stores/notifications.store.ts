// Zustand https://zustand-demo.pmnd.rs/
// Store used for global state of Notifications.
// The Notifications are stored in a session storage mode, and can be accessed from any component at any level.
// This store is used in the footer component, at the left side.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface INotification {
  date?: string;
  message: string;
  type: 'success' | 'warning' | 'error';
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
        notification.date = nd.toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h24' });
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
