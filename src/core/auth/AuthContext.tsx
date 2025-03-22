// External imports
import { createContext, useState, useEffect } from 'react';
// Imports
import type { IPayload } from '@core/auth/interfaces/payload.interface';
import { AuthService } from '@auth/services/auth.service';
// Interface
interface IAuthContext {
  loading: boolean;
  login(email: string, password: string): Promise<IPayload>;
  logout(): Promise<void>;
  user: IPayload | null;
}
// Context
export const AuthContext = createContext<IAuthContext | null>(null);
// React provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser(): Promise<void> {
      try {
        const userData = await AuthService.getAdmin();
        const user: IPayload = userData.data.data;

        setUser({ _id: user._id, email: user.email, role: user.role });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(email: string, password: string): Promise<IPayload> {
    const userData = await AuthService.login({ email, password });
    const user: IPayload = userData.data.data;

    setUser({ _id: user._id, email: user.email, role: user.role });

    return userData.data.data;
  }

  async function logout(): Promise<void> {
    await AuthService.logout();
    setUser(null);
  }

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
