// Icons: https://lucide.dev/icons
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp } from 'lucide-react';
// External components
import { ChartContainer } from '@core/components/ui/chart';
import { Pie, PieChart } from 'recharts';
// External imports
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStats } from '@microsites/interfaces/statistics.interface';
import { EStatus } from '@appointments/enums/status.enum';
import { StatisticsService } from '@microsites/services/statistics.service';
// Interface
interface IProps {
  professionalId?: string;
  todayStats?: IStats;
}
// React component
export function MicrositeStats({ professionalId, todayStats }: IProps) {
  const [animationKey, setAnimationKey] = useState<string>('');

  const { data: historicalAppos, refetch: refetchHistoricalAppos } = useQuery<IResponse<IStats>, Error>({
    queryKey: ['microsite-stats', 'historical', professionalId],
    queryFn: async () => {
      if (!professionalId) throw new Error('Professional ID is required');
      return await StatisticsService.countApposByProfessional(professionalId);
    },
  });

  const chartData = useMemo(
    () => [
      { status: EStatus.ATTENDED, value: todayStats?.attended || 0, fill: 'oklch(0.765 0.177 163.223)' },
      { status: EStatus.NOT_ATTENDED, value: todayStats?.notAttended || 0, fill: 'oklch(0.712 0.194 13.428)' },
      { status: EStatus.NOT_STATUS, value: todayStats?.notStatus || 0, fill: 'oklch(0.704 0.04 256.788)' },
      { status: EStatus.WAITING, value: todayStats?.waiting || 0, fill: 'oklch(0.828 0.189 84.429)' },
    ],
    [todayStats?.attended, todayStats?.notAttended, todayStats?.notStatus, todayStats?.waiting],
  );

  useEffect(() => {
    if (todayStats && chartData) setAnimationKey(JSON.stringify(chartData));
    refetchHistoricalAppos();
  }, [chartData, refetchHistoricalAppos, todayStats]);

  return (
    <main className='flex flex-col gap-6 overflow-auto'>
      <section className='flex flex-col gap-2 text-sm'>
        <h1 className='text-xs font-semibold uppercase text-muted-foreground'>Hoy</h1>
        <section className='flex flex-row items-center gap-3' key={animationKey}>
          {todayStats && todayStats.total > 0 && (
            <div>
              <ChartContainer config={{}} className='aspect-square h-[50px] w-[50px]'>
                <PieChart>
                  <Pie
                    isAnimationActive={true}
                    animationDuration={1000}
                    data={chartData}
                    dataKey='value'
                    nameKey='status'
                    innerRadius={12.5}
                    outerRadius={25}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          )}
          <div className='flex flex-col'>
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
