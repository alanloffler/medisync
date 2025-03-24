import type { AxiosResponse } from 'axios';
import type { ILogin } from '@core/auth/interfaces/login.interface';
import type { IPayload } from '@core/auth/interfaces/payload.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { api } from '@auth/services/axios.service';

export class AuthService {
  public static async login({ email, password }: ILogin): Promise<AxiosResponse<IResponse<IPayload>>> {
    console.log('Logging in...', email, password);
    try {
      const response = await api({
        method: 'POST',
        url: '/auth/login',
        data: { email, password },
        withCredentials: true,
      });

      console.log('Login successful', response);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  public static async logout(): Promise<AxiosResponse<IResponse<null>>> {
    try {
      const response = await api({
        method: 'GET',
        url: '/auth/logout',
        withCredentials: true,
      });

      return response;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public static async getAdmin(): Promise<AxiosResponse<IResponse<IPayload>>> {
    try {
      const response = await api({
        method: 'GET',
        url: '/auth/admin',
        withCredentials: true,
      });

      console.log('User fetched', response);
      return response;
    } catch (error) {
      console.error('User fetch failed:', error);
      throw error;
    }
  }
}
