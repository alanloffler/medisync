import type { IAppointment, IAppointmentForm } from '@appointments/interfaces/appointment.interface';
import type { IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { SortingState } from '@tanstack/react-table';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class AppointmentApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;
  // CHECKED: used on ReserveAppointments.tsx
  public static async findAllByProfessional(id: string, day: string) {
    const path: string = `${this.API_URL}/appointments/byProfessional`;
    const url: URL = UtilsUrl.create(path, { id, day });

    return await UtilsUrl.fetch(url, EMethods.GET);
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
  public static async findSearch(
    search: IAppointmentSearch[],
    sorting: SortingState,
    skip: number,
    limit: number,
  ): Promise<IResponse<IAppointment[]>> {
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
  public static async update(id: string, status: string): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments/${id}`;
    const url = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.PATCH, { status });
  }
  // CHECKED: used on AppoFlowCard.tsx
  public static async getStatistics() {
    const path: string = `${this.API_URL}/appointments/statistics`;
    const url = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
  // CHECKED: used on DateSelection.tsx
  public static async daysWithAppos(professionalId: string, year: number, month: number) {
    let transformedMonth: string, transformedYear: string;
    month < 10 ? (transformedMonth = `0${month}`) : (transformedMonth = `${month}`);
    year < 10 ? (transformedYear = `0${year}`) : (transformedYear = `${year}`);

    const path: string = `${this.API_URL}/appointments/daysWithAppos`;
    const url = UtilsUrl.create(path, { professionalId, year: transformedYear, month: transformedMonth });

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

  // CHECKED: used on DialogReserve.tsx
  public static async create(data: IAppointmentForm): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.POST, data);
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
  // CHECKED: used on DialogReserve.tsx
  public static async remove(id: string): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments/${id}`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.DELETE);
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
}
