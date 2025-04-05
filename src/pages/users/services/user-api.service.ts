import type { IResponse } from '@core/interfaces/response.interface';
import type { ITableManager } from '@core/interfaces/table.interface';
import type { IUser, IUserForm } from '@users/interfaces/user.interface';
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import type { IUserStats } from '@users/interfaces/user-stats.interface';
import { EMethods } from '@core/enums/methods.enum';
import { EUserSearch } from '@users/enums/user-search.enum';
import { UserUtils } from '@users/services/user.utils';
import { UtilsUrl } from '@core/services/utils/url.service';

// Checked: all
// TRQ fetch: all
// Typed response: all but searchUsersBy

export class UserApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async create(data: IUserForm): Promise<IResponse<IUser>> {
    const transformedData: IUserForm = UserUtils.lowercaseFormItems(data);
    const path: string = `${this.API_URL}/users`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.POST, transformedData);
  }

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
    // return await UtilsUrl.axiosFetch(url, EMethods.GET);
  }

  public static async findOne(id: string): Promise<IResponse<IUser>> {
    const path: string = `${this.API_URL}/users/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  public static async update(id: string, data: IUserForm): Promise<IResponse<IUser>> {
    const transformedData: IUserForm = UserUtils.lowercaseFormItems(data);
    const path: string = `${this.API_URL}/users/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.PATCH, transformedData);
  }

  public static async remove(id: string): Promise<IResponse<IUser>> {
    const path: string = `${this.API_URL}/users/remove/${id}`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.PATCH);
  }

  public static async newUsersToday(): Promise<IResponse<IUserStats>> {
    const path: string = `${this.API_URL}/users/newUsersToday`;
    const url: URL = new URL(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // New methods admin readonly
  // CHECKED: used on DialogRemovedUsers.tsx
  public static async findRemovedUsers(): Promise<IResponse<IUser[]>> {
    const path: string = `${this.API_URL}/users/removedUsers`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
