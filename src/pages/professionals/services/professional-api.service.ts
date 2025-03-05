import type { IProfessional, IProfessionalForm } from '@professionals/interfaces/professional.interface';
import type { IProfessionalSearch } from '@professionals/interfaces/professional-search.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { ITableManager } from '@core/interfaces/table.interface';
import { EMethods } from '@core/enums/methods.enum';
import { EProfessionalSearch } from '@professionals/enums/professional-search.enum';
import { ProfessionalUtils } from '@professionals/services/professional.utils';
import { UtilsUrl } from '@core/services/utils/url.service';

export class ProfessionalApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;
  // TODO: replace area codes from config file to service where the area codes return fake promise

  public static async create(data: IProfessionalForm): Promise<IResponse<IProfessional>> {
    // throw new Error('not implemented');
    // This transformation must be done in the backend, same as in update
    const transformedData = ProfessionalUtils.lowercaseFormItems(data);

    const path: string = `${this.API_URL}/professionals`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.POST, transformedData);
  }

  // CHECKED:
  // Used on component ProfessionalsDataTable.tsx
  // Find all professionals by name or specialization (many professionals with partial search)
  public static async searchProfessionalsBy(search: IProfessionalSearch, tableManager: ITableManager, skip: number) {
    const { type, value } = search;
    const { pagination, sorting } = tableManager;

    let path: string = '';
    if (type === EProfessionalSearch.INPUT) path = `${this.API_URL}/professionals`;
    if (type === EProfessionalSearch.DROPDOWN) path = `${this.API_URL}/professionals/specialization`;
    if (!type) throw new Error('Dev Error: searchBy is required and must be a valid enum of EProfessionalSearch');

    const url: URL = new URL(path);

    if (type === EProfessionalSearch.INPUT) url.searchParams.append('search', value);
    if (type === EProfessionalSearch.DROPDOWN) url.searchParams.append('id', value);
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', pagination.pageSize.toString());
    url.searchParams.append('sk', sorting[0].id);
    url.searchParams.append('sv', sorting[0].desc ? 'desc' : 'asc');

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED: used on ViewProfessional.tsx
  public static async findOne(id: string): Promise<IResponse<IProfessional>> {
    const path: string = `${this.API_URL}/professionals/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED: used on UpdateProfessional.tsx
  public static async update(id: string, data: IProfessionalForm): Promise<IResponse<IProfessional>> {
    const path: string = `${this.API_URL}/professionals/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.PATCH, data);
  }

  // CHECKED: used on AvailableProfessional.tsx
  // TODO: see type of response, create one in backend
  // TODO: type method on useQuery/useMutation
  public static async updateAvailability(id: string, availability: string): Promise<IResponse<any>> {
    const path: string = `${this.API_URL}/professionals/${id}/availability`;
    const url: URL = new URL(path);
    const body: { available: boolean } = { available: availability === 'true' ? true : false };

    return await UtilsUrl.fetch(url, EMethods.PATCH, body);
  }

  // TODO: type response with interface
  // TODO: type method on useQuery/useMutation
  public static async countAll(): Promise<IResponse<any>> {
    const path: string = `${this.API_URL}/professionals/databaseCount`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED:
  // Used on ProfessionalsCombobox.tsx and ProfessionalsSelect.tsx
  public static async findAllActive(): Promise<IResponse<IProfessional[]>> {
    const path: string = `${this.API_URL}/professionals/active`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED:
  // Used on component ProfessionalsSelect.tsx on replace service
  public static async findAllAvailableForChange(day: string, hour: string): Promise<IResponse<IProfessional[]>> {
    const path: string = `${this.API_URL}/professionals/availableForChange`;
    const url: URL = new URL(path);
    url.searchParams.append('day', day);
    url.searchParams.append('hour', hour);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED: used on ProfessionalsDataTable.tsx
  public static async remove(id: string) {
    const url: URL = new URL(`${this.API_URL}/professionals/${id}`);

    return await UtilsUrl.fetch(url, EMethods.DELETE);
  }
}
