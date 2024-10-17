import type { IAppointmentForm } from '@/pages/appointments/interfaces/appointment.interface';

export class AppointmentApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAllByProfessional(id: string, day: string) {
    const url: string = `${this.API_URL}/appointments/byProfessional?id=${id}&day=${day}`;

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

  public static async remove(id: string) {
    const url: string = `${this.API_URL}/appointments/${id}`;

    try {
      const query: Response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      return await query.json();
    } catch (e) {
      return e;
    }
  }
}
