import type { IAppoAttendance } from '@appointments/interfaces/appos-attendance.interface';
import type { IAppointment, IAppointmentForm } from '@appointments/interfaces/appointment.interface';
import type { IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStatistic } from '@appointments/interfaces/statistic.interface';
import type { SortingState } from '@tanstack/react-table';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class AppointmentApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  // * CHECKED: used on DailySchedule.tsx and MicrositeSchedule.tsx
  public static async findAllByProfessional(id: string, day: string): Promise<IResponse<IAppointment[]>> {
    const path: string = `${this.API_URL}/appointments/byProfessional`;
    const url: URL = UtilsUrl.create(path, { id, day });

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on AppoDataTable.tsx
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

  // * CHECKED: used on AppoDataTable.tsx and StatusSelect.tsx
  public static async update(id: string, professional?: string, status?: string): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments/${id}`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.PATCH, { professional, status });
  }

  // * CHECKED: used on AppoFlowCard.tsx
  public static async getStatistics(): Promise<IResponse<IStatistic[]>> {
    const path: string = `${this.API_URL}/appointments/statistics`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on DateSelection.tsx
  public static async daysWithAppos(professionalId: string, year: number, month: number): Promise<IResponse<{ day: string }[]>> {
    let transformedMonth: string, transformedYear: string;
    month < 10 ? (transformedMonth = `0${month}`) : (transformedMonth = `${month}`);
    year < 10 ? (transformedYear = `0${year}`) : (transformedYear = `${year}`);

    const path: string = `${this.API_URL}/appointments/daysWithAppos`;
    const url: URL = UtilsUrl.create(path, { professionalId, year: transformedYear, month: transformedMonth });

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on DBCountAppos.tsx
  public static async countTotalAppointments(): Promise<IResponse<number>> {
    const path: string = `${this.API_URL}/appointments/count`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on ApposRecord.tsx
  public static async findApposRecordWithFilters(
    userId: string,
    limit?: number,
    page?: number,
    professionalId?: string,
    year?: string,
  ): Promise<IResponse<IAppointment[]>> {
    if (userId) {
      const path: string = `${this.API_URL}/appointments/byFilters`;

      const params = {
        u: userId,
        l: String(limit),
        pg: String(page),
        p: professionalId,
        y: year,
      };

      const url: URL = UtilsUrl.create(path, params);

      return await UtilsUrl.fetch(url, EMethods.GET);
    } else {
      throw new Error('Dev Error: UserId is required');
    }
  }

  // * CHECKED: used on DialogReserve.tsx
  public static async create(data: IAppointmentForm): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.POST, data);
  }

  // * CHECKED: used on ViewAppointment.tsx
  public static async findOne(id: string): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments/${id}`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on ApposTable.tsx and DialogReserve.tsx
  public static async remove(id: string): Promise<IResponse<IAppointment>> {
    const path: string = `${this.API_URL}/appointments/${id}`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.DELETE);
  }

  // * CHECKED: used on ApposFilters.tsx
  public static async findUniqueProfessionalsByUser(userId: string): Promise<IResponse<IProfessional[]>> {
    const path: string = `${this.API_URL}/appointments/uniqueProfessionalsByUser`;
    const params = { u: userId };
    const url: URL = UtilsUrl.create(path, params);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on ApposFilters.tsx
  public static async findApposYearsByUser(userId: string): Promise<IResponse<string[]>> {
    const path: string = `${this.API_URL}/appointments/yearsByUser`;
    const params = { u: userId };
    const url: URL = UtilsUrl.create(path, params);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on ApposAttendance.tsx
  public static async getAttendance(): Promise<IResponse<IAppoAttendance[]>> {
    const path: string = `${this.API_URL}/appointments/attendance`;
    const url: URL = UtilsUrl.create(path);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
