import { APP_CONFIG } from '@config/app.config';
import { EMethods } from '@core/enums/methods.enum';
import { IResponse } from '@core/interfaces/response.interface';

export class UtilsService {
  public static createUrl(path: string, params?: Record<string, string>): URL {
    const url = new URL(path);
    if (params) Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    return url;
  }

  public static async fetch(url: string | URL, method: EMethods, body?: any) {
    try {
      const query: Response = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(body),
      });

      const response: IResponse = await query.json();
      if (!query.ok) throw new Error(response.message);

      return response;
    } catch (error) {
      if (error instanceof TypeError) throw new Error(APP_CONFIG.error.server);
      throw error;
    }
  }
}
