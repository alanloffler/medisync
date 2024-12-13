export class UtilsService {
  public static createUrl(path: string, params?: Record<string, string>): URL {
    const url = new URL(path);
    if (params) Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    return url;
  }
}
