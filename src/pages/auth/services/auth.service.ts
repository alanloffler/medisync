import type { AxiosResponse } from 'axios';
import type { IResponse } from '@core/interfaces/response.interface';
import { api, refreshTokens } from '@auth/services/axios.service';

interface ILogin {
  email: string;
  password: string;
}

export interface IPayload {
  _id: string;
  email: string;
  role: string;
}

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

  public static async logout(): Promise<void> {
    try {
      await api({
        method: 'POST',
        url: '/auth/logout',
        withCredentials: true,
      });

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public static async getUser(): Promise<AxiosResponse<IResponse<IPayload>>> {
    try {
      const response = await api({
        method: 'GET',
        url: '/auth/user',
        withCredentials: true,
      });

      console.log('User fetched', response);
      return response;
    } catch (error) {
      console.error('User fetch failed:', error);
      throw error;
    }
  }

  public static async refreshTokens(): Promise<boolean> {
    return await refreshTokens();
  }
}
