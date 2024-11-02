export class DashboardApiService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async countAll() {
    const url: string = `${this.API_URL}/users/dashboard/countAll`;

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
