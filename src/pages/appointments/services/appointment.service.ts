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
