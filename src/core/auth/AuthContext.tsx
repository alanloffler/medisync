import { createContext, useState, useEffect } from 'react';
import { AuthService, type IPayload } from '@auth/services/auth.service';

interface IAuthContext {
  user: IPayload | null;
  login(email: string, password: string): Promise<IPayload>;
  logout(): Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser(): Promise<void> {
      try {
        const userData = await AuthService.getUser();
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

  async function login(email: string, password: string) {
    const userData = await AuthService.login({ email, password });
    const user: IPayload = userData.data.data;

    setUser({ _id: user._id, email: user.email, role: user.role });

    return userData.data.data;
  }

  async function logout() {
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
