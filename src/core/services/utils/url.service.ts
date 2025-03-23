import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';
import { api } from '@auth/services/axios.service';

export class UtilsUrl {
  public static create(path: string, params?: Record<string, string | undefined>): URL {
    const url = new URL(path);
    if (params) Object.entries(params).forEach(([key, value]) => value && url.searchParams.set(key, value));

    return url;
  }

  // public static async _deprecated_fetch(url: string | URL, method: EMethods, body?: any): Promise<IResponse> {
  //   const accessToken: string | undefined = localStorage.getItem('accessToken') ?? undefined;

  //   try {
  //     const query: Response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         'content-type': 'application/json;charset=UTF-8',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify(body),
  //     });

  //     const response: IResponse = await query.json();
  //     if (!query.ok) throw new Error(response.message);

  //     return response;
  //   } catch (error) {
  //     if (error instanceof TypeError) throw new Error('error.internalServer');
  //     throw error;
  //   }
  // }

  public static async fetch(url: string | URL, method: EMethods, body?: any): Promise<IResponse<any>> {
    try {
      const query = await api({
        method,
        url: url.toString(),
        data: body,
        withCredentials: true,
      });

      return query.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response.data.message);
    }
  }
}
