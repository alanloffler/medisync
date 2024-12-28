import type { IMessage } from '@whatsapp/interfaces/message.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class WhatsappApiService {
  private static readonly WA_API_URL: string = import.meta.env.VITE_WA_API_URL;

  // TODO: type response
  public static async send(data: IMessage): Promise<IResponse<any>> {
    const path: string = `${this.WA_API_URL}/sendMessage`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.POST, data);
  }
}
