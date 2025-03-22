// External imports
import { useContext } from 'react';
// Imports
import { AuthContext } from '@core/auth/AuthContext';
// React hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth hook must be used within an AuthProvider');

  return context;
}
