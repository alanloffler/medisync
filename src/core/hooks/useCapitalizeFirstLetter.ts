import { useCallback } from 'react';

function useCapitalizeFirstLetter() {
	return useCallback((sentence: string | undefined) => {
		if (sentence) {
      const words = sentence.split(' ');
			return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ');
		} else {
			return;
		}
	}, []);
}

export { useCapitalizeFirstLetter };
