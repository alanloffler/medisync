import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void): (() => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener('change', callback);
      return () => {
        matchMedia.removeEventListener('change', callback);
      };
    },
    [query],
  );

  const getSnapshot = (): boolean => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = (): boolean => {
    throw new Error('useMediaQuery is a client-only hook');
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
