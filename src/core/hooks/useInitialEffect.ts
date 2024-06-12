import { useEffect, useRef } from 'react';

export const useInitialEffect = (callback: () => void) => {
  const initialCall = useRef(true);

  useEffect(() => {
    if (initialCall.current) {
      callback();
      initialCall.current = false;
    }
  }, [callback]);
};
