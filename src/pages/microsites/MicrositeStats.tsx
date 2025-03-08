// Icons: https://lucide.dev/icons
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp } from 'lucide-react';
// External imports
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStats } from '@microsites/interfaces/statistics.interface';
import { StatisticsService } from '@microsites/services/statistics.service';
// Interface
interface IProps {
  professionalId?: string;
  todayStats?: IStats;
}
// React component
export function MicrositeStats({ professionalId, todayStats }: IProps) {
  const { data: historicalAppos, refetch: refetchHistoricalAppos } = useQuery<IResponse<IStats>, Error>({
    queryKey: ['microsite-stats', 'historical', professionalId],
    queryFn: async () => {
      if (!professionalId) throw new Error('Professional ID is required');
      return await StatisticsService.countApposByProfessional(professionalId);
    },
  });

  useEffect(() => {
    refetchHistoricalAppos();
  }, [refetchHistoricalAppos, todayStats]);

  return (
    <main className='flex flex-col gap-6 overflow-auto'>
      <section className='flex flex-col gap-2 text-sm'>
        <h1 className='text-xs font-semibold uppercase text-muted-foreground'>Hoy</h1>
        <section className='flex flex-col'>
          <div className='flex items-center gap-1'>
            <span className='text-lg font-semibold'>{todayStats?.total}</span>
            <span className='text-sm'>turnos en total</span>
          </div>
          <div className='flex items-center gap-3 text-xsm'>
            <div className='flex items-center gap-0.5 text-sm'>
              <span>{todayStats?.attended}</span>
              <ArrowUp size={15} strokeWidth={2} className='text-emerald-400' />
            </div>
            <div className='flex items-center gap-0.5 text-sm'>
              <span>{todayStats?.notAttended}</span>
              <ArrowDown size={15} strokeWidth={2} className='text-rose-400' />
            </div>
            {todayStats && todayStats.waiting > 0 && (
              <div className='flex items-center gap-0.5 text-sm'>
                <span>{todayStats?.waiting}</span>
                <ArrowRight size={15} strokeWidth={2} className='text-amber-400' />
              </div>
            )}
            {todayStats && todayStats.notStatus > 0 && (
              <div className='flex items-center gap-0.5 text-sm'>
                <span>{todayStats?.notStatus}</span>
                <ArrowDownRight size={15} strokeWidth={2} className='text-slate-400' />
              </div>
            )}
          </div>
        </section>
      </section>
      <section className='flex flex-col gap-2 text-sm'>
        <h1 className='text-xs font-semibold uppercase text-muted-foreground'>Historial</h1>
        <section className='flex flex-col'>
          <div className='flex items-center gap-1'>
            <span className='text-lg font-semibold'>{historicalAppos?.data.total}</span>
            <span className='text-sm'>turnos en total</span>
          </div>
          <div className='flex items-center gap-3 text-xsm'>
            <div className='flex items-center gap-0.5 text-sm'>
              <span>{historicalAppos?.data.attended}</span>
              <ArrowUp size={15} strokeWidth={2} className='text-emerald-400' />
            </div>
            <div className='flex items-center gap-0.5 text-sm'>
              <span>{historicalAppos?.data.notAttended}</span>
              <ArrowDown size={15} strokeWidth={2} className='text-rose-400' />
            </div>
            {historicalAppos && historicalAppos.data.waiting > 0 && (
              <div className='flex items-center gap-0.5 text-sm'>
                <span>{historicalAppos?.data.waiting}</span>
                <ArrowRight size={15} strokeWidth={2} className='text-amber-400' />
              </div>
            )}
            {historicalAppos && historicalAppos.data.notStatus > 0 && (
              <div className='flex items-center gap-0.5 text-sm'>
                <span>{historicalAppos?.data.notStatus}</span>
                <ArrowDownRight size={15} strokeWidth={2} className='text-slate-400' />
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
