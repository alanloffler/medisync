import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';

export class SpecializationService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll() {
    const url: string = `${this.API_URL}/specializations`;
    const method: string = 'GET';

    return await this.fetch(url, method);
  }

  private static async fetch(url: string, method: string) {
    try {
      const query: Response = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      const response: IResponse = await query.json();

      if (!query.ok) throw new Error(response.message);

      return response;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(APP_CONFIG.error.server);
      }
      throw error;
    }
  }
}
