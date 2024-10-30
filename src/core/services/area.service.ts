export class AreaService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll() {
    try {
      const fetchData = await fetch(`${this.API_URL}/areas/active`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });
      
      return await fetchData.json();
    } catch (error) {
      return error;
    }
  }
}
