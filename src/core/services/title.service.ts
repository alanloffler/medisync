import type { IResponse } from '@core/interfaces/response.interface';
import type { ITitle } from '@core/interfaces/title.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class TitleService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll(): Promise<IResponse<ITitle[]>> {
    const path: string = `${this.API_URL}/titles`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
