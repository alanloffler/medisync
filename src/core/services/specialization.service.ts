import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class SpecializationService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll(): Promise<IResponse<ISpecialization[]>> {
    const path: string = `${this.API_URL}/specializations`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
