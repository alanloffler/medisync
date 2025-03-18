import type { AxiosResponse } from 'axios';
import type { IResponse } from '@core/interfaces/response.interface';
import { api } from '@auth/services/axios.service';

interface ILogin {
  email: string;
  password: string;
}

export class AuthService {
  public static async login({ email, password }: ILogin): Promise<AxiosResponse<IResponse>> {
    console.log('Logging in...', email, password);
    try {
      const response = await api({
        method: 'POST',
        url: '/auth/login',
        data: { email, password },
      });

      console.log('Login successful', response);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
}
