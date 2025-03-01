// Icons: https://lucide.dev/icons/
import { ArrowDownRight, ArrowUpRight, Database } from 'lucide-react';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import type { IStats } from '@core/interfaces/response.interface';
import { cn } from '@lib/utils';
// Interface
interface IProps {
  className?: string;
  stats?: IStats;
}
// React component
export function DBCountApposByUser({ className, stats }: IProps) {
  const { t } = useTranslation();

  return (
    <main className={cn('flex flex-row gap-3 !text-xsm text-slate-400', className)}>
      <section className='flex items-center space-x-1'>
        <Database size={16} strokeWidth={2} className='text-orange-400' />
        <span>{t('table.totalItems.appointments', { count: stats?.total })}</span>
      </section>
      <section className={cn(className, 'flex items-center space-x-0.5')}>
        <ArrowUpRight size={16} strokeWidth={2} className='text-emerald-400' />
        <span>{t('table.attendance.attended', { count: stats?.attended })}</span>
      </section>
      <section className={cn(className, 'flex items-center space-x-0.5')}>
        <ArrowDownRight size={16} strokeWidth={2} className='text-rose-400' />
        <span>{t('table.attendance.notAttended', { count: stats?.notAttended })}</span>
      </section>
    </main>
  );
}
