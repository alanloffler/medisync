// Icons: https://lucide.dev/icons/
import { ArrowDownLeft, ArrowUpRight, Database } from 'lucide-react';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useQuery } from '@tanstack/react-query';
// Imports
import { PROF_CONFIG } from '@config/professionals.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
// React component
export function DBCountProfessional() {
  const {
    data: dbCount,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['professionals', 'db-count'],
    queryFn: async () => await ProfessionalApiService.databaseCount(),
  });

  const total: number = dbCount?.data.total;
  const available: number = dbCount?.data.available;
  const notAvailable: number = dbCount?.data.notAvailable;

  if (isLoading) return <LoadingDB variant='default' empty />;
  if (isError) return <main className='py-2'></main>;

  return (
    <main className='flex flex-row justify-end gap-2 py-3 text-xsm font-normal text-slate-400'>
      {total && (
        <section className='flex items-center space-x-1'>
          <Database size={16} strokeWidth={2} className='text-blue-400' />
          <span>{`${total} ${total === 1 ? PROF_CONFIG.table.databaseCount.totalSingular : PROF_CONFIG.table.databaseCount.totalPlural}`}</span>
        </section>
      )}
      <section className='flex flex-row space-x-2'>
        {available && (
          <div className='flex items-center'>
            <ArrowUpRight size={16} strokeWidth={2} className='text-emerald-400' />
            <span>{`${available} ${available === 1 ? PROF_CONFIG.table.databaseCount.availableSingular : PROF_CONFIG.table.databaseCount.availablePlural}`}</span>
          </div>
        )}
        {notAvailable && (
          <div className='flex items-center'>
            <ArrowDownLeft size={16} strokeWidth={2} className='text-rose-400' />
            <span>{`${notAvailable} ${notAvailable === 1 ? PROF_CONFIG.table.databaseCount.notAvailableSingular : PROF_CONFIG.table.databaseCount.notAvailablePlural}`}</span>
          </div>
        )}
      </section>
    </main>
  );
}
