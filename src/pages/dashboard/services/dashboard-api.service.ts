import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';

// TODO: get response status message from config file

export class DashboardApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async countAppointments() {
    const url1: string = `${this.API_URL}/dashboard/countAppointments`;
    const url2: string = `${this.API_URL}/dashboard/countAppointmentsLastMonth`;

    const value1: IResponse = await this.fetch(url1, 'GET');
    const value2: IResponse = await this.fetch(url2, 'GET');

    if (value1 instanceof Error || value2 instanceof Error) return { statusCode: 500, message: APP_CONFIG.error.server, data: undefined };
    if (value1.statusCode > 399 || value2.statusCode > 399) return { statusCode: value1.statusCode, message: value1.message, data: undefined };

    return { statusCode: 200, message: 'Appointments count found', data: { value1: value1.data, value2: value2.data } };
  }

  public static async latestAppointments(limit: number) {
    const url: string = `${this.API_URL}/dashboard/latestAppointments?l=${limit}`;
    return await this.fetch(url, 'GET');
  }

  public static async countUsers() {
    const url1: string = `${this.API_URL}/dashboard/countUsers`;
    const url2: string = `${this.API_URL}/dashboard/countUsersLastMonth`;

    const value1: IResponse = await this.fetch(url1, 'GET');
    const value2: IResponse = await this.fetch(url2, 'GET');

    if (value1 instanceof Error || value2 instanceof Error) return { statusCode: 500, message: APP_CONFIG.error.server, data: undefined };
    if (value1.statusCode > 399) return { statusCode: value1.statusCode, message: value1.message, data: undefined };
    if (value2.statusCode > 399) return { statusCode: value2.statusCode, message: value2.message, data: undefined };

    return { statusCode: 200, message: 'Users count found', data: { value1: value1.data, value2: value2.data } };
  }

  public static async latestUsers(limit: number) {
    const url: string = `${this.API_URL}/dashboard/latestUsers?l=${limit}`;
    return await this.fetch(url, 'GET');
  }

  public static async countProfessionals() {
    const url1: string = `${this.API_URL}/dashboard/countProfessionals`;
    const url2: string = `${this.API_URL}/dashboard/countProfessionalsLastMonth`;

    const value1: IResponse = await this.fetch(url1, 'GET');
    const value2: IResponse = await this.fetch(url2, 'GET');

    if (value1 instanceof Error || value2 instanceof Error) return { statusCode: 500, message: APP_CONFIG.error.server, data: undefined };
    if (value1.statusCode > 399) return { statusCode: value1.statusCode, message: value1.message, data: undefined };
    if (value2.statusCode > 399) return { statusCode: value2.statusCode, message: value2.message, data: undefined };

    return { statusCode: 200, message: 'Professionals count found', data: { value1: value1.data, value2: value2.data } };
  }

  public static async apposDaysCount(days: number) {
    const url: string = `${this.API_URL}/dashboard/apposDaysCount?d=${days}`;
    return await this.fetch(url, 'GET');
  }

  private static async fetch(url: string, method: string) {
    try {
      const query: Response = await fetch(url, {
        method: method,
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
}
