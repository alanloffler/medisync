// Components
import { Loading } from '@core/components/common/Loading';
// External imports
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// Imports
import { useAuth } from '@core/auth/useAuth';
// Interface
interface IProps {
  children: ReactNode;
  roles: string[];
}
// React component
export function PrivateRoute({ children, roles }: IProps) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) return <Navigate to='/' />;

  // TODO: unauthorized page
  if (roles && !roles.includes(user.role)) return <Navigate to='/' replace />;

  return <>{children}</>;
}
