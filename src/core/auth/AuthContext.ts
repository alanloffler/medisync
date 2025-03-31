import { createContext } from 'react';
import type { AxiosResponse } from 'axios';
import type { IPayload } from '@core/auth/interfaces/payload.interface';
import type { IResponse } from '@core/interfaces/response.interface';
// Interface
interface IAuthContext {
  loading: boolean;
  login(email: string, password: string): Promise<AxiosResponse<IResponse<IPayload>> & { redirectPath?: string }>;
  logout(): Promise<AxiosResponse<IResponse<null>> & { redirectPath?: string }>;
  user: IPayload | null;
}
// Context
export const AuthContext = createContext<IAuthContext | null>(null);
