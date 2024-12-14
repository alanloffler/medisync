import type { IAppointmentForm } from '@appointments/interfaces/appointment.interface';
import type { IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { SortingState } from '@tanstack/react-table';
import { APP_CONFIG } from '@config/app.config';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class AppointmentApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;
  // CHECKED: used on ReserveAppointments.tsx
  public static async findAllByProfessional(id: string, day: string) {
    const path: string = `${this.API_URL}/appointments/byProfessional`;
    const url: URL = UtilsUrl.create(path, { id, day });

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

  public static async findAllByUser(id: string) {
    const url: string = `${this.API_URL}/appointments/byUser?id=${id}`;

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
  // CHECKED: used on appointments.tsx
  public static async findSearch(search: IAppointmentSearch[], sorting: SortingState, skip: number, limit: number) {
    const path: string = `${this.API_URL}/appointments/search`;
    const url = UtilsUrl.create(path);

    const body = {
      search,
      skip,
      limit,
      sortingKey: sorting[0].id,
      sortingValue: sorting[0].desc ? 'desc' : 'asc',
    };

    return await UtilsUrl.fetch(url, EMethods.POST, body);
  }
  // CHECKED: used on StatusSelect.tsx
  public static async update(id: string, status: string): Promise<IResponse> {
    const url: string = `${this.API_URL}/appointments/${id}`;

    return await UtilsUrl.fetch(url, EMethods.PATCH, { status });
  }
  // CHECKED: used on AppoFlowCard.tsx
  public static async getStatistics() {
    const path: string = `${this.API_URL}/appointments/statistics`;
    const url = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  public static async countTotalAppointments() {
    const url: string = `${this.API_URL}/appointments/count`;
    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // FIXME: check if is unused method
  public static async findAllByUserAndProfessional(userId: string, professionalId: string) {
    const url: string = `${this.API_URL}/appointments/byUserAndProfessional?user=${userId}&professional=${professionalId}`;

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

  public static async findApposRecordWithFilters(userId: string, professionalId?: string, year?: string) {
    if (userId) {
      let url: string = `${this.API_URL}/appointments/byFilters?u=${userId}`;

      professionalId !== 'null' && professionalId ? (url = `${url}&p=${professionalId}`) : (url = `${url}`);
      year !== 'null' && year ? (url = `${url}&y=${year}`) : (url = `${url}`);

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
    } else {
      console.log('userId is undefined');
    }
  }

  public static async create(data: IAppointmentForm) {
    const url: string = `${this.API_URL}/appointments`;

    try {
      const query = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data),
      });

      return await query.json();
    } catch (error) {
      return error;
    }
  }

  public static async findOne(id: string) {
    const url: string = `${this.API_URL}/appointments/${id}`;

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
  // WIP: method for use with TRQ
  public static async remove(id: string) {
    const url: string = `${this.API_URL}/appointments/${id}`;

    try {
      const query: Response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
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

  // ApposRecord component methods
  public static async findUniqueProfessionalsByUser(userId: string) {
    const url: string = `${this.API_URL}/appointments/uniqueProfessionalsByUser?u=${userId}`;

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

  public static async findApposYearsByUser(userId: string) {
    const url: string = `${this.API_URL}/appointments/yearsByUser?u=${userId}`;

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

  public static async findApposMonthsByUser(userId: string, year: string) {
    const url: string = `${this.API_URL}/appointments/monthsByUser?u=${userId}&y=${year}`;

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

  // Generic fetch method
  // private static async fetch(url: string | URL, method: EMethods, body?: any) {
  //   try {
  //     const query: Response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         'content-type': 'application/json;charset=UTF-8',
  //       },
  //       body: JSON.stringify(body),
  //     });

  //     const response: IResponse = await query.json();
  //     if (!query.ok) throw new Error(response.message);

  //     return response;
  //   } catch (error) {
  //     if (error instanceof TypeError) {
  //       throw new Error(APP_CONFIG.error.server);
  //     }
  //     throw error;
  //   }
  // }
}
