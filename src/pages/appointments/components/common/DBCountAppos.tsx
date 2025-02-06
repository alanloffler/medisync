// Icons: https://lucide.dev/icons/
import { Database } from 'lucide-react';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { cn } from '@lib/utils';
// React component
export function DBCountAppos({ className }: { className?: string }) {
  const { t } = useTranslation();

  const {
    data: count,
    isLoading,
    isError,
  } = useQuery<IResponse<number>>({
    queryKey: ['appointments', 'countTotalAppointments'],
    queryFn: () => AppointmentApiService.countTotalAppointments(),
    refetchOnWindowFocus: 'always',
  });
  if (isLoading) return <LoadingDB variant='default' empty />;
  if (isError) return <main className='py-2'></main>;

  return (
    <main className={cn('flex flex-row gap-2 text-xsm font-normal text-slate-400', className)}>
      {count?.data && (
        <section className='flex items-center space-x-1'>
          <Database size={16} strokeWidth={2} className='text-blue-400' />
          <span>{t('table.totalItems.appointments', { count: count.data })}</span>
        </section>
      )}
    </main>
  );
}
