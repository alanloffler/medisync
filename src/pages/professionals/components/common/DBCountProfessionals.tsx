// Icons: https://lucide.dev/icons/
import { ArrowDownLeft, ArrowUpRight, Database } from 'lucide-react';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { IResponse } from '@core/interfaces/response.interface';
import { AxiosError } from 'axios';
// React component
export function DBCountProfessionals() {
  const { t } = useTranslation();

  const {
    data: dbCount,
    error,
    isLoading,
    isError,
  } = useQuery<IResponse, AxiosError<any>>({
    queryKey: ['professionals', 'db-count'],
    queryFn: async () => await ProfessionalApiService.countAll(),
  });

  const total: number = dbCount?.data.total;
  const available: number = dbCount?.data.available;
  const notAvailable: number = dbCount?.data.notAvailable;

  if (isLoading)
    return (
      <main className='py-2.5'>
        <LoadingDB variant='default' empty className='w-full justify-end p-0' />
      </main>
    );
  if (isError) return <main className='py-3 text-right text-xsm text-rose-400'>{error.response?.data.message}</main>;

  return (
    <main className='flex flex-row justify-end gap-2 py-3 text-xsm font-normal text-slate-400'>
      {total && total > 0 && (
        <section className='flex items-center space-x-1'>
          <Database size={16} strokeWidth={2} className='text-orange-400' />
          <span>{t('table.totalItems.professionals', { count: total })}</span>
        </section>
      )}
      <section className='flex flex-row space-x-2'>
        {available && (
          <div className='flex items-center'>
            <ArrowUpRight size={16} strokeWidth={2} className='text-emerald-400' />
            <span>{t('table.availableItems.default', { count: available })}</span>
          </div>
        )}
        {notAvailable && (
          <div className='flex items-center'>
            <ArrowDownLeft size={16} strokeWidth={2} className='text-rose-400' />
            <span>{t('table.notAvailableItems.default', { count: notAvailable })}</span>
          </div>
        )}
      </section>
    </main>
  );
}
