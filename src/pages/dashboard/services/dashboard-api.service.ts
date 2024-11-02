import type { IResponse } from "@core/interfaces/response.interface";
import { APP_CONFIG } from "@config/app.config";

// TODO: get response status message from config file

export class DashboardApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async countAppointments() {
    const url1: string = `${this.API_URL}/dashboard/countAppointments`;
    const url2: string = `${this.API_URL}/dashboard/countAppointmentsLastMonth`;

    const value1: IResponse = await this.getResponse(url1);
    const value2: IResponse = await this.getResponse(url2);

    if (value1 instanceof Error || value2 instanceof Error) return { statusCode: 500, message: APP_CONFIG.error.server, data: undefined };
    if (value1.statusCode > 399 || value2.statusCode > 399) return { statusCode: value1.statusCode, message: value1.message, data: undefined };

    return { statusCode: 200, message: 'Appointments count found', data: { value1: value1.data, value2: value2.data } };
  }

  public static async countAllUsers() {
    const url1: string = `${this.API_URL}/dashboard/countUsers`;
    const url2: string = `${this.API_URL}/dashboard/countUsersLastMonth`;

    const value1: IResponse = await this.getResponse(url1);
    const value2: IResponse = await this.getResponse(url2);

    if (value1 instanceof Error || value2 instanceof Error) return { statusCode: 500, message: APP_CONFIG.error.server, data: undefined };
    if (value1.statusCode > 399 || value2.statusCode > 399) return { statusCode: value1.statusCode, message: value1.message, data: undefined };

    return { statusCode: 200, message: 'Appointments count found', data: { value1: value1.data, value2: value2.data } };
  }

  private static async getResponse(url: string) {
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
}
