export class TitleService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async findAll() {
    try {
      const url: string = `${this.API_URL}/titles`;
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
