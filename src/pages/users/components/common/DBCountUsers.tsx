// Icons: https://lucide.dev/icons/
import { Database } from 'lucide-react';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useQuery } from '@tanstack/react-query';
// Imports
import { USER_CONFIG } from '@config/user.config';
import { UserApiService } from '@users/services/user-api.service';
// React component
export function DBCountUsers() {
  const {
    data: dbCount,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', 'db-count'],
    queryFn: async () => await UserApiService.databaseCount(),
  });

  const total: number = dbCount?.data.total;

  if (isLoading) return <LoadingDB variant='default' empty />;
  if (isError) return <main className='py-2'></main>;

  return (
    <main className='flex flex-row justify-end gap-2 py-3 text-xsm font-normal text-slate-400'>
      {total && (
        <section className='flex items-center space-x-1'>
          <Database size={16} strokeWidth={2} className='text-blue-400' />
          <span>{`${total} ${total === 1 ? USER_CONFIG.table.databaseCount.totalSingular : USER_CONFIG.table.databaseCount.totalPlural}`}</span>
        </section>
      )}
    </main>
  );
}
