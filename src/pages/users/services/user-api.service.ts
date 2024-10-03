import type { IUserForm } from '@/pages/users/interfaces/user.interface';
import type { SortingState } from '@tanstack/react-table';
import { UserUtils } from '@/pages/users/services/user.utils';

export class UserApiService {
  private static readonly API_URL = import.meta.env.VITE_API_URL;

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

  public static async findAll(search: string, sorting: SortingState, skip: number, limit: number) {
    const url: string = `${this.API_URL}/users?search=${search}&skip=${skip}&limit=${limit}&sk=${sorting[0].id}&sv=${sorting[0].desc ? 'desc' : 'asc'}`;

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
  // Find all users by DNI (many users with partial DNI search)
  public static async findAllByDNI(search: string, sorting: SortingState, skip: number, limit: number) {
    const url: string = `${this.API_URL}/users/byDNI?search=${search}&skip=${skip}&limit=${limit}&sk=${sorting[0].id}&sv=${sorting[0].desc ? 'desc' : 'asc'}`;

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
}
