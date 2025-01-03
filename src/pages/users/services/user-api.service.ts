import type { IResponse } from '@core/interfaces/response.interface';
import type { ITableManager } from '@core/interfaces/table.interface';
import type { IUser, IUserForm } from '@users/interfaces/user.interface';
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import { APP_CONFIG } from '@config/app.config';
import { EMethods } from '@core/enums/methods.enum';
import { EUserSearch } from '@users/enums/user-search.enum';
import { UserUtils } from '@users/services/user.utils';
import { UtilsUrl } from '@core/services/utils/url.service';

export class UserApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  // CHECKED: TRQ used on CreateUser.tsx
  public static async create(data: IUserForm): Promise<IResponse<IUser>> {
    const transformedData: IUserForm = UserUtils.lowercaseFormItems(data);
    const path: string = `${this.API_URL}/users`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.POST, transformedData);
  }

  // CHECKED: TRQ used on
  // - UsersCombo.tsx
  // - UsersDataTable.tsx
  // Find all users by identity number or name (many users with partial search)
  public static async searchUsersBy(search: IUserSearch, tableManager: ITableManager, skip: number) {
    const { type, value } = search;
    const { pagination, sorting } = tableManager;

    let path: string = '';
    if (type === EUserSearch.NAME) path = `${this.API_URL}/users`;
    if (type === EUserSearch.IDENTITY) path = `${this.API_URL}/users/byIdentityNumber`;
    if (!type) throw new Error('Dev Error: searchBy is required and must be a valid enum of EUserSearch');

    const url: URL = new URL(path);

    url.searchParams.append('search', value);
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', pagination.pageSize.toString());
    url.searchParams.append('sk', sorting[0].id);
    url.searchParams.append('sv', sorting[0].desc ? 'desc' : 'asc');

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED: TRQ used on
  // SendEmail.tsx OK!
  // UpdateUser.tsx
  // WhatsApp.tsx
  public static async findOne(id: string): Promise<IResponse<IUser>> {
    const path: string = `${this.API_URL}/users/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // CHECKED: TRQ used on
  // - UsersDataTable.tsx
  public static async remove(id: string) {
    const url: URL = new URL(`${this.API_URL}/users/${id}`);

    return await UtilsUrl.fetch(url, EMethods.DELETE);
  }

  // CHECKED: TRQ used on
  // - UpdateUser.tsx
  public static async update(id: string, data: IUserForm): Promise<IResponse<IUser>> {
    const transformedData: IUserForm = UserUtils.lowercaseFormItems(data);
    const path: string = `${this.API_URL}/users/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.PATCH, transformedData);
  }

  // CHECKED: TRQ used on
  // - DBCountUsers.tsx
  public static async newUsersToday(): Promise<IResponse<{ percentage: number; today: number; total: number }>> {
    const path: string = `${this.API_URL}/users/newUsersToday`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
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
