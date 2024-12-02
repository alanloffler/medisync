import type { IProfessional, IProfessionalForm } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { SortingState } from '@tanstack/react-table';
import { APP_CONFIG } from '@config/app.config';
import { EMethods } from '@core/enums/methods.enum';
import { ProfessionalUtils } from '@professionals/services/professional.utils';

export class ProfessionalApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll(search: string, sorting: SortingState, skip: number, limit: number) {
    const url: string = `${this.API_URL}/professionals?search=${search}&skip=${skip}&limit=${limit}&sk=${sorting[0].id}&sv=${sorting[0].desc ? 'desc' : 'asc'}`;

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

  public static async findAllActive(): Promise<IResponse<IProfessional[]>> {
    const url: string = `${this.API_URL}/professionals/active`;

    try {
      const query: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      const response: IResponse<IProfessional[]> = await query.json();
      if (!query.ok) throw new Error(response.message);

      return response;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(APP_CONFIG.error.server);
      }

      throw error;
    }
  }

  public static async findBySpecialization(id: string, sorting: SortingState, skip: number, limit: number) {
    const url: string = `${this.API_URL}/professionals/specialization?id=${id}&limit=${limit}&skip=${skip}&sk=${sorting[0].id}&sv=${sorting[0].desc ? 'desc' : 'asc'}`;

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

  public static async remove(id: string) {
    const url: string = `${this.API_URL}/professionals/${id}`;
    try {
      const query: Response = await fetch(url, {
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
