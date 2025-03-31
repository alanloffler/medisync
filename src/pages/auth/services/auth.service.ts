import type { AxiosResponse } from 'axios';
import type { ILogin } from '@core/auth/interfaces/login.interface';
import type { IPayload } from '@core/auth/interfaces/payload.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { api } from '@auth/services/axios.service';

export class AuthService {
  public static async login({ email, password }: ILogin): Promise<AxiosResponse<IResponse<IPayload>>> {
    const response = await api({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
      withCredentials: true,
    });

    return response;
  }

  public static async logout(): Promise<AxiosResponse<IResponse<null>>> {
    const response = await api({
      method: 'GET',
      url: '/auth/logout',
      withCredentials: true,
    });

    return response;
  }

  public static async getAdmin(): Promise<AxiosResponse<IResponse<IPayload>>> {
    const response = await api({
      method: 'GET',
      url: '/auth/admin',
      withCredentials: true,
    });

    return response;
  }
}
