// External imports
import i18next from 'i18next';
import { z } from 'zod';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';
import { emailSchema } from '@email/schemas/email.schema';

export class EmailApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async sendEmail(data: z.infer<typeof emailSchema>): Promise<IResponse<any>> {
    const url: string = `${this.API_URL}/email/send`;
    return await this.fetch(url, EMethods.POST, data);
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
