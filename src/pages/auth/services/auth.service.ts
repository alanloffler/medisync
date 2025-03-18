import type { IResponse } from '@core/interfaces/response.interface';

interface ILogin {
  email: string;
  password: string;
}

export class AuthService {
  private static readonly API_URL: string = import.meta.env.VITE_API_URL;

  public static async login({ email, password }: ILogin): Promise<IResponse<any>> {
    console.log('Logging in...', email, password);
    return await { data: null, message: 'Login successful' };
  }
}
