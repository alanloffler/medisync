// Icons: https://lucide.dev/icons
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp } from 'lucide-react';
// External components
// https://ui.shadcn.com/docs/components
import { ChartContainer } from '@core/components/ui/chart';
import { Progress } from '@core/components/ui/progress';
// https://recharts.org
import { Pie, PieChart } from 'recharts';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { SkeletonDonutStat } from '@microsites/common/SkeletonDonutStat';
import { SkeletonProgress } from '@microsites/common/SkeletonProgress';
import { SkeletonStat } from '@microsites/common/SkeletonStat';
// External imports
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStats } from '@microsites/interfaces/statistics.interface';
import { EStatus } from '@appointments/enums/status.enum';
import { StatisticsService } from '@microsites/services/statistics.service';
// Interface
interface IProps {
  apposIsLoading: boolean;
  professionalId?: string;
  showToday: boolean;
  todayStats?: IStats;
}
// React component
export function MicrositeStats({ apposIsLoading, professionalId, showToday, todayStats }: IProps) {
  const [animationKey, setAnimationKey] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const { i18n } = useTranslation();

  const {
    data: historicalAppos,
    isError: historicalIsError,
    isLoading: historicalIsLoading,
    isSuccess: historicalIsSuccess,
    refetch: refetchHistoricalAppos,
  } = useQuery<IResponse<IStats>, Error>({
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
    if (todayStats) refetchHistoricalAppos();
  }, [chartData, refetchHistoricalAppos, todayStats]);

  useEffect(() => {
    const total: number | undefined = todayStats?.total;
    if (!total) return;
    if (todayStats?.timeSlots) {
      const percentage: number = (total / todayStats?.timeSlots) * 100;
      setProgress(percentage);
    } else {
      setProgress(0);
    }
  }, [todayStats?.timeSlots, todayStats?.total]);

  if (historicalIsError) return <InfoCard size='xsm' text='Error buscando datos estadísticos' type='flat' variant='error' />;

  if (!historicalIsError)
    return (
      <main className='flex flex-col gap-6 overflow-auto'>
        {(apposIsLoading || historicalIsLoading) && (
          <section className='flex flex-col gap-6'>
            <SkeletonDonutStat />
            <SkeletonProgress />
          </section>
        )}
        {!apposIsLoading && !historicalIsLoading && showToday && (
          <>
            <section className='flex flex-col gap-2 text-sm'>
              <h1 className='text-xs font-semibold uppercase text-muted-foreground'>Hoy</h1>
              <section className='flex flex-row items-center gap-3'>
                {todayStats && todayStats.total !== undefined && todayStats.total > 0 && (
                  <ChartContainer className='aspect-square h-[50px] w-[50px]' config={{}} key={animationKey}>
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
                )}
                {todayStats && (
                  <motion.div
                    className='flex flex-col'
                    key={`${JSON.stringify(todayStats)}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: todayStats?.total && todayStats.total > 0 ? 0.5 : 0 }}
                  >
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
                      {todayStats && todayStats.waiting !== undefined && todayStats.waiting > 0 && (
                        <div className='flex items-center gap-0.5 text-sm'>
                          <span>{todayStats.waiting}</span>
                          <ArrowRight size={15} strokeWidth={2} className='text-amber-400' />
                        </div>
                      )}
                      {todayStats && todayStats.notStatus !== undefined && todayStats.notStatus > 0 && (
                        <div className='flex items-center gap-0.5 text-sm'>
                          <span>{todayStats.notStatus}</span>
                          <ArrowDownRight size={15} strokeWidth={2} className='text-slate-400' />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </section>
            </section>
            <section className='flex flex-col gap-1 text-sm'>
              <h1 className='w-fit text-xs font-medium text-muted-foreground'>Progreso de reservas</h1>
              <section className='flex w-full items-center gap-3 py-1 text-xsm lg:w-1/2'>
                <Progress value={progress} className='h-3 bg-slate-200 [&_div]:bg-sky-400' />
                <span className='font-medium text-sky-500'>
                  {i18n.format(progress, 'number', 'es')}
                  <small>%</small>
                </span>
              </section>
            </section>
          </>
        )}
        {historicalIsLoading && <SkeletonStat />}
        {historicalIsSuccess && (
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
        )}
      </main>
    );
}
