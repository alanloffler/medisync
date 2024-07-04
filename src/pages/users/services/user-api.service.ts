import { IUserForm } from '../interfaces/user.interface';
import { SortingState } from '@tanstack/react-table';
import { UserUtils } from '@/pages/users/services/user.utils';

export class UserApiService {
  private static readonly API_URL = import.meta.env.VITE_API_URL;

  public static async findAll(search: string, sorting: SortingState, skip: number, limit: number) {
    const url: string = `${this.API_URL}/users?search=${search}&skip=${skip}&limit=${limit}&sk=${sorting[0].id}&sv=${sorting[0].desc ? 'desc' : 'asc'}`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
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
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
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
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async create(data: IUserForm) {
    const transformedData = UserUtils.lowercaseFormItems(data);
    const url: string = `${this.API_URL}/users`;

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

  public static async remove(id: string) {
    const url: string = `${this.API_URL}/users/${id}`;

    try {
      const query = await fetch(url, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }
}
