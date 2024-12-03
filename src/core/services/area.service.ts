import i18next from 'i18next';
import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';

export class AreaService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll() {
    const url: string = `${this.API_URL}/areas`;
    return await this.fetch(url, EMethods.GET);
  }

  private static async fetch(url: string, method: EMethods, body?: any): Promise<IResponse<any>> {
    try {
      const query: Response = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(body),
      });

      const response: IResponse<any> = await query.json();
      if (!query.ok) throw new Error(response.message);

      return response;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(i18next.t('error.internalServer'));
      }
      throw error;
    }
  }
}
