import type { IArea } from '@core/interfaces/area.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class AreaService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll(): Promise<IResponse<IArea[]>> {
    const path: string = `${this.API_URL}/areas`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
