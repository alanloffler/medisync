import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';

export class UtilsUrl {
  // TODO: get token from http-only cookie
  private static readonly token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2QwZWQ3YTE5OTAyZDU1N2M0ZTM1NWYiLCJlbWFpbCI6ImFsYW5tYXRpYXNsb2ZmbGVyQGdtYWlsLmNvbSIsInJvbGUiOiJzdXBlciIsImlhdCI6MTc0MTkxMjI2NX0.-gIU2v6he5zedS_npdCPf-K-lSeSJZh3VO03JSlc_g8';
  public static create(path: string, params?: Record<string, string | undefined>): URL {
    const url = new URL(path);
    if (params) Object.entries(params).forEach(([key, value]) => value && url.searchParams.set(key, value));

    return url;
  }

  public static async fetch(url: string | URL, method: EMethods, body?: any): Promise<IResponse> {
    try {
      const query: Response = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });

      const response: IResponse = await query.json();
      if (!query.ok) throw new Error(response.message);

      return response;
    } catch (error) {
      if (error instanceof TypeError) throw new Error('error.internalServer');
      throw error;
    }
  }
}
