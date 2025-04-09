import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import type { IChartData } from '@dashboard/interfaces/statistic.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { EMethods } from '@core/enums/methods.enum';
import { UtilsUrl } from '@core/services/utils/url.service';

export class DashboardApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  // * CHECKED: used on StatisticGroup.tsx
  public static async apposDaysCount(days: number): Promise<IResponse<IChartData[]>> {
    const path: string = `${this.API_URL}/dashboard/apposDaysCount`;
    const params = { d: String(days) };
    const url: URL = UtilsUrl.create(path, params);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on StatisticGroup.tsx
  public static async countAppointments(): Promise<IResponse<{ value1: string; value2: string } | undefined>> {
    const path1: string = `${this.API_URL}/dashboard/countAppointments`;
    const path2: string = `${this.API_URL}/dashboard/countAppointmentsLastMonth`;
    const url1: URL = UtilsUrl.create(path1);
    const url2: URL = UtilsUrl.create(path2);

    const value1: IResponse = await UtilsUrl.fetch(url1, EMethods.GET);
    const value2: IResponse = await UtilsUrl.fetch(url2, EMethods.GET);

    if (value1 instanceof Error || value2 instanceof Error)
      return {
        data: undefined,
        message: 'APP_CONFIG.error.server',
        statusCode: 500,
      };
    if (value1.statusCode > 399 || value2.statusCode > 399)
      return {
        data: undefined,
        message: value1.message,
        statusCode: value1.statusCode,
      };

    return {
      data: { value1: value1.data, value2: value2.data },
      message: 'Appointments count found',
      statusCode: 200,
    };
  }

  // * CHECKED: used on StatisticGroup.tsx
  public static async countProfessionals(): Promise<IResponse<{ value1: string; value2: string } | undefined>> {
    const path1: string = `${this.API_URL}/dashboard/countProfessionals`;
    const path2: string = `${this.API_URL}/dashboard/countProfessionalsLastMonth`;
    const url1: URL = UtilsUrl.create(path1);
    const url2: URL = UtilsUrl.create(path2);

    const value1: IResponse = await UtilsUrl.fetch(url1, EMethods.GET);
    const value2: IResponse = await UtilsUrl.fetch(url2, EMethods.GET);

    if (value1 instanceof Error || value2 instanceof Error)
      return {
        data: undefined,
        message: 'APP_CONFIG.error.server',
        statusCode: 500,
      };
    if (value1.statusCode > 399 || value2.statusCode > 399)
      return {
        data: undefined,
        message: value1.message,
        statusCode: value1.statusCode,
      };

    return {
      data: { value1: value1.data, value2: value2.data },
      message: 'Professionals count found',
      statusCode: 200,
    };
  }

  // * CHECKED: used on StatisticGroup.tsx
  public static async countUsers(): Promise<IResponse<{ value1: string; value2: string } | undefined>> {
    const path1: string = `${this.API_URL}/dashboard/countUsers`;
    const path2: string = `${this.API_URL}/dashboard/countUsersLastMonth`;
    const url1: URL = UtilsUrl.create(path1);
    const url2: URL = UtilsUrl.create(path2);

    const value1: IResponse = await UtilsUrl.fetch(url1, EMethods.GET);
    const value2: IResponse = await UtilsUrl.fetch(url2, EMethods.GET);

    if (value1 instanceof Error || value2 instanceof Error)
      return {
        data: undefined,
        message: 'APP_CONFIG.error.server',
        statusCode: 500,
      };
    if (value1.statusCode > 399)
      return {
        data: undefined,
        message: value1.message,
        statusCode: value1.statusCode,
      };

    return {
      data: { value1: value1.data, value2: value2.data },
      message: 'Users count found',
      statusCode: 200,
    };
  }

  // * CHECKED: used on LatestAppos.tsx
  public static async latestAppointments(limit: number): Promise<IResponse<IAppointment[]>> {
    const path: string = `${this.API_URL}/dashboard/latestAppointments`;
    const params = { l: String(limit) };
    const url: URL = UtilsUrl.create(path, params);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }

  // * CHECKED: used on LatestUsers.tsx
  public static async latestUsers(limit: number): Promise<IResponse<IUser[]>> {
    const path: string = `${this.API_URL}/dashboard/latestUsers`;
    const params = { l: String(limit) };
    const url: URL = UtilsUrl.create(path, params);

    return await UtilsUrl.fetch(url, EMethods.GET);
  }
}
