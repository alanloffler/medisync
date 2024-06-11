function useTruncateText() {
  const truncateText = (text: string, maxLength: number, symbol?: string) => {
    if (!text || maxLength === 0) return;
    if (symbol === undefined) symbol = '';

    if (text.length > maxLength) {
      if (maxLength > 1) return text.substring(0, maxLength) + symbol;
      if (maxLength < 0) return symbol + text.substring(text.length + maxLength, text.length);
    } else {
      return text;
    }
  };

  return truncateText;
}

export { useTruncateText };
