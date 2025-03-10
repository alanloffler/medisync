import type { IResponse } from '@core/interfaces/response.interface';
import type { IStats } from '@microsites/interfaces/statistics.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class StatisticsService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async countApposByProfessional(id: string): Promise<IResponse<IStats>> {
    const path: string = `${this.API_URL}/statistics/countApposByProfessional`;
    const url: URL = new URL(path);

    url.searchParams.append('id', id);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
