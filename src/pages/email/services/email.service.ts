// External imports
import { z } from 'zod';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';
import { emailSchema } from '@email/schemas/email.schema';

export class EmailApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async sendEmail(data: z.infer<typeof emailSchema>): Promise<IResponse<any>> {
    const path: string = `${this.API_URL}/email/send`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.POST, data);
  }
}
