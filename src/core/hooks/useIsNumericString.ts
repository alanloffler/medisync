function useIsNumericString() {
  return (input: string): boolean | undefined => {
    if (input) {
      return /^\d+$/.test(input);
    } else {
      return undefined;
    }
  };
}

export { useIsNumericString };
