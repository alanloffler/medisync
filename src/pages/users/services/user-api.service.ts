import type { IResponse } from '@core/interfaces/response.interface';
import type { IUserForm } from '@users/interfaces/user.interface';
import type { SortingState } from '@tanstack/react-table';
import { APP_CONFIG } from '@config/app.config';
import { EMethods } from '@core/enums/methods.enum';
import { EUserSearch } from '@users/enums/user-search.enum';
import { UserUtils } from '@users/services/user.utils';
import { UtilsUrl } from '@core/services/utils/url.service';

export class UserApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async create(data: IUserForm) {
    const transformedData: IUserForm = UserUtils.lowercaseFormItems(data);
    const url: string = `${this.API_URL}/users`;

    try {
      const query: Response = await fetch(url, {
        body: JSON.stringify(transformedData),
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  // CHECKED: TRQ used on 
  // - UsersCombo.tsx
  // - UsersDataTable.tsx
  // Find all users by identity number (many users with partial identity number search)
  public static async searchUsersBy(search: string, sorting: SortingState, skip: number, limit: number, searchBy: string) {
    let path: string = '';
    if (searchBy === EUserSearch.NAME) path = `${this.API_URL}/users`;
    if (searchBy === EUserSearch.IDENTITY) path = `${this.API_URL}/users/byIdentityNumber`;
    if (!searchBy || searchBy === '') throw new Error('Dev Error: searchBy is required and must be a valid enum of EUserSearch');

    const url: URL = new URL(path);

    url.searchParams.append('search', search);
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('sk', sorting[0].id);
    url.searchParams.append('sv', sorting[0].desc ? 'desc' : 'asc');

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  public static async findOne(id: string) {
    const url: string = `${this.API_URL}/users/${id}`;

    try {
      const query: Response = await fetch(url, {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async remove(id: string) {
    const url: string = `${this.API_URL}/users/${id}`;

    try {
      const query: Response = await fetch(url, {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'DELETE',
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async update(id: string, data: IUserForm) {
    const transformedData: IUserForm = UserUtils.lowercaseFormItems(data);
    const url: string = `${this.API_URL}/users/${id}`;

    try {
      const query: Response = await fetch(url, {
        body: JSON.stringify(transformedData),
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PATCH',
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async countAll() {
    const url: string = `${this.API_URL}/users/databaseCount`;
    return await this.fetch(url, EMethods.GET);
  }

  public static async countByMonth(month: number, year: number) {
    const url: string = `${this.API_URL}/users/countByMonth?m=${month}&y=${year}`;
    return await this.fetch(url, EMethods.GET);
  }

  public static async differenceBetweenMonths(month: number, year: number) {
    const actualMonth = this.countByMonth(month, year);
    const prevMonth = this.countByMonth(month - 1, year);

    const response = await Promise.all([actualMonth, prevMonth]);

    let percentage: number;
    response[0].data.total >= response[1].data.total ? (percentage = 100) : (percentage = -100);

    return (response[0].data.total / response[1].data.total) * percentage;
  }

  private static async fetch(url: string, method: EMethods, body?: any) {
    try {
      const query: Response = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(body),
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
}
