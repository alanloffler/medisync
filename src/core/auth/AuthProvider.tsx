// External imports
import type { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';
// Imports
import type { IPayload } from '@core/auth/interfaces/payload.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';
import { AuthContext } from '@core/auth/AuthContext';
import { AuthService } from '@auth/services/auth.service';
// React provider component
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IPayload | null>(null);

  const loadUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await AuthService.getAdmin();
      const user: IPayload = userData.data.data;

      setUser({ _id: user._id, email: user.email, role: user.role });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function login(email: string, password: string): Promise<AxiosResponse<IResponse<IPayload>> & { redirectPath?: string }> {
    const userData = await AuthService.login({ email, password });
    const user: IPayload = userData.data.data;

    setUser({ _id: user._id, email: user.email, role: user.role });
    setLoading(false);

    return { ...userData, redirectPath: `${APP_CONFIG.appPrefix}${APP_CONFIG.appIndexPage}` };
  }

  async function logout(): Promise<AxiosResponse<IResponse<null>> & { redirectPath?: string }> {
    const response = await AuthService.logout();
    setUser(null);
    setLoading(false);

    return { ...response, redirectPath: '/caca' };
  }

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
