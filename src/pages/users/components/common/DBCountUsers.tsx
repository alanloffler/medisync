// Icons: https://lucide.dev/icons/
import { Database, TrendingDown, TrendingUp } from 'lucide-react';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import i18n from '@core/i18n/i18n';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import { UserApiService } from '@users/services/user-api.service';
// React component
export function DBCountUsers() {
  const { t } = useTranslation();

  const {
    data: dbCount,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', 'db-count'],
    queryFn: async () => await UserApiService.countAll(),
  });

  const { data: diffPrevMonth } = useQuery({
    queryKey: ['users', 'diffPrevMonth'],
    queryFn: async () => await UserApiService.differenceBetweenMonths(new Date().getMonth() + 1, new Date().getFullYear()),
  });

  const total: number = dbCount?.data.total;

  if (isLoading) return <LoadingDB variant='default' empty />;
  if (isError) return <main className='py-2'></main>;

  return (
    total && (
      <main className='flex flex-row justify-end gap-2 py-3 text-xsm font-normal text-slate-400'>
        <section className='flex items-center space-x-1'>
          <Database size={16} strokeWidth={2} className='text-blue-400' />
          <span>{t('table.totalItems.users', { count: total })}</span>
        </section>
        {diffPrevMonth && (
          <section className='flex items-center space-x-1'>
            {diffPrevMonth && diffPrevMonth >= 0 ? (
              <TrendingUp size={16} strokeWidth={2} className='text-emerald-400' />
            ) : (
              <TrendingDown size={16} strokeWidth={2} className='text-rose-400' />
            )}
            <div>
              <span>{diffPrevMonth >= 0 ? '+' : ''}</span>
              <span>{`${i18n.format(diffPrevMonth, 'number', i18n.resolvedLanguage)}%`}</span>
            </div>
            <span>{t('table.difference.lastMonth')}</span>
          </section>
        )}
      </main>
    )
  );
}
