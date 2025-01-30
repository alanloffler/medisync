enum ECapitalize {
  all = 'all',
  each = 'each',
  first = 'first',
}

export class UtilsString {
  public static upperCase(content?: string, type?: keyof typeof ECapitalize, standardize?: boolean): string {
    let result: string = '';
    if (!content) return result;
    if (!type) type = 'first';
    if (standardize) content = content.toLowerCase();

    if (content) {
      if (type === 'first') {
        result = content.charAt(0).toUpperCase() + content.slice(1);
      } else if (type === 'each') {
        result = content
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      } else if (type === 'all') {
        result = content.toUpperCase();
      }
    }

    return result;
  }

  public static convertText(text: string, type: 'toHtml' | 'toWhatsApp' = 'toHtml'): string {
    if (type === 'toHtml') {
      text = text.replace(/\\\*/g, '&#42;')
                 .replace(/\\_/g, '&#95;')
                 .replace(/\\~/g, '&#126;')
                 .replace(/\\`/g, '&#96;')
                 .replace(/\n/g, '<br>');
    }

    const patterns: { [key: string]: [RegExp, string][] } = {
      toHtml: [
        [/\*((?!\*)[^*]+)\*/g, '<b>$1</b>'],
        [/_((?!_)[^_]+)_/g, '<i>$1</i>'],
        [/~((?!~)[^~]+)~/g, '<s>$1</s>'],
        [/```((?!```)[^`]+)```/g, '<code>$1</code>'],
        [/&#42;/g, '*'],
        [/&#95;/g, '_'],
        [/&#126;/g, '~'],
        [/&#96;/g, '`'],
      ],
      toWhatsApp: [
        [/<br\s*\/?>/gi, '\n'],
        [/<br\s*>\s*<\/br>/gi, '\n'],
        [/<b>(.*?)<\/b>/g, '*$1*'],
        [/<strong>(.*?)<\/strong>/g, '*$1*'],
        [/<i>(.*?)<\/i>/g, '_$1_'],
        [/<em>(.*?)<\/em>/g, '_$1_'],
        [/<s>(.*?)<\/s>/g, '~$1~'],
        [/<strike>(.*?)<\/strike>/g, '~$1~'],
        [/<del>(.*?)<\/del>/g, '~$1~'],
        [/<code>(.*?)<\/code>/g, '```$1```'],
      ],
    };

    return patterns[type].reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), text);
  }
}
