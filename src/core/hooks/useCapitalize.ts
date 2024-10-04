import { useCallback } from 'react';

export function useCapitalize() {
  return useCallback((sentence: string | undefined) => {
    if (sentence) {
      return sentence
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      return '';
    }
  }, []);
}
