// Icons: https://lucide.dev/icons/
import { Database, MoveRight, TrendingDown, TrendingUp } from 'lucide-react';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import i18n from '@core/i18n/i18n';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { UserApiService } from '@users/services/user-api.service';
// React component
export function DBCountUsers() {
  const { t } = useTranslation();

  const { data, isError, isLoading } = useQuery<IResponse<{ percentage: number; today: number; total: number }>>({
    queryKey: ['users', 'DBCountUsers'],
    queryFn: async () => await UserApiService.newUsersToday(),
  });

  if (isLoading) return <LoadingDB variant='default' empty />;
  if (isError) return <main className='py-2'></main>;

  return (
    data?.data && (
      <main className='flex flex-row justify-end gap-2 py-3 text-xsm font-normal text-slate-400'>
        <section className='flex items-center space-x-1'>
          <Database size={16} strokeWidth={2} className='text-orange-400' />
          <span>{t('table.totalItems.users', { count: data.data.total })}</span>
        </section>
        <section className='flex items-center space-x-1'>
          {data.data.percentage > 0 && <TrendingUp size={16} strokeWidth={2} className='text-emerald-400' />}
          {data.data.percentage < 0 && <TrendingDown size={16} strokeWidth={2} className='text-rose-400' />}
          {data.data.percentage === 0 && <MoveRight size={16} strokeWidth={2} className='text-inherit' />}
          <div>
            <span>{data.data.percentage > 0 ? '+' : ''}</span>
            <span>{`${i18n.format(Number(data.data.percentage), 'number', i18n.resolvedLanguage)}%`}</span>
          </div>
          <span>{t('table.difference.yesterday')}</span>
        </section>
      </main>
    )
  );
}
