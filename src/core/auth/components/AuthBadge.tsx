// Icons: https://lucide.dev/icons/
import { LockKeyholeOpen } from 'lucide-react';
// Imports
import { useAuth } from '@core/auth/useAuth';
// React component
export function AuthBadge() {
  const { user } = useAuth();

  return (
    <section className='flex items-center !gap-2 rounded-md bg-indigo-100 p-1.5 pr-2 text-xxs font-normal uppercase text-indigo-500'>
      <LockKeyholeOpen size={13} strokeWidth={2} />
      {user?.role}
    </section>
  );
}
