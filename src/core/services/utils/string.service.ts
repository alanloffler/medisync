export class UtilsString {
  public static capitalize(str: string): string {
    if (str) {
      return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      return '';
    }
  }
}