export function useDelimiter() {
  const insertDelimiterEveryThreeDigits = (input: string | number, delimiter: string, each: number): string => {
    if (typeof input === 'number') input = input.toString();
    if (!input) return '';

    const cleanedInput = input.replace(new RegExp(`\\${delimiter}`, 'g'), '');

    let result = '';
    let count = 0;

    for (let i = cleanedInput.length - 1; i >= 0; i--) {
      result = cleanedInput[i] + result;
      count++;

      if (count % each === 0 && i > 0) result = delimiter + result;
    }

    return result;
  };

  return insertDelimiterEveryThreeDigits;
}
