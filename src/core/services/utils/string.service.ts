enum ECapitalize {
  all = 'all',
  each = 'each',
  first = 'first',
}

export class UtilsString {
  public static upperCase(content: string, type?: keyof typeof ECapitalize, standardize?: boolean): string {
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
}
