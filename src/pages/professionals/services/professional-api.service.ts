import i18next from 'i18next';
import type { IProfessional, IProfessionalForm } from '@professionals/interfaces/professional.interface';
import type { IProfessionalSearch } from '@professionals/interfaces/professional-search.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { ITableManager } from '@core/interfaces/table.interface';
import { APP_CONFIG } from '@config/app.config';
import { EMethods } from '@core/enums/methods.enum';
import { EProfessionalSearch } from '@professionals/enums/professional-search.enum';
import { ProfessionalUtils } from '@professionals/services/professional.utils';
import { UtilsUrl } from '@core/services/utils/url.service';

export class ProfessionalApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  // CHECKED: TRQ used on
  // - ProfessionalsDataTable.tsx
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

  public static async create(data: IProfessionalForm) {
    const transformedData = ProfessionalUtils.lowercaseFormItems(data);
    const url: string = `${this.API_URL}/professionals`;

    try {
      const query = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(transformedData),
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async findOne(id: string) {
    const url: string = `${this.API_URL}/professionals/${id}`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (e) {
      return e;
    }
  }
  // TODO FORMATTED DATA TO LOWER CASE INPUTS
  public static async update(id: string, data: IProfessionalForm) {
    const url: string = `${this.API_URL}/professionals/${id}`;

    try {
      const query: Response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data),
      });

      return await query.json();
    } catch (e) {
      return e;
    }
  }
  // TanStack query response format
  public static async updateAvailability(id: string, availability: string) {
    const url: string = `${this.API_URL}/professionals/${id}/availability`;

    try {
      const query: Response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({ available: availability === 'true' ? true : false }),
      });

      const response: IResponse = await query.json();
      if (!query.ok) throw new Error(response.message);

      return response;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(APP_CONFIG.error.server);
      }

      throw error;
    }
  }

  // TanStack query response format
  public static async countAll() {
    const url: string = `${this.API_URL}/professionals/databaseCount`;
    return await this.fetch(url, EMethods.GET);
  }

  public static async findAllActive(): Promise<IResponse<IProfessional[]>> {
    const url: string = `${this.API_URL}/professionals/active`;
    return await this.fetch(url, EMethods.GET);
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

  // CHECKED: used on ProfessionalsDataTable.tsx
  public static async remove(id: string) {
    const url: URL = new URL(`${this.API_URL}/professionals/${id}`);

    return await UtilsUrl.fetch(url, EMethods.DELETE);
  }
}
