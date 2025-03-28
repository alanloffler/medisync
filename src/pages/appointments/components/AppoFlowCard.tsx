// Icons: https://lucide.dev/icons
import { ChartLine, MoveRight, TrendingDown, TrendingUp } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// https://number-flow.barvian.me/
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
// Components
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStatistic } from '@appointments/interfaces/statistic.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { cn } from '@lib/utils';
// Interfaces
interface IProps {
  className?: string;
}
// Constants
const intervalTime: number = 5000;
// React component
export function AppoFlowCard({ className }: IProps) {
  const [flowValue, setFlowValue] = useState<IStatistic | undefined>(undefined);
  const { i18n, t } = useTranslation();

  const {
    data: flowContent,
    error,
    isError,
    isLoading,
  } = useQuery<IResponse<IStatistic[]>>({
    queryKey: ['appointments', 'statistics'],
    queryFn: async () => await AppointmentApiService.getStatistics(),
    refetchOnWindowFocus: 'always',
  });

  useEffect(() => {
    let index: number = 0;
    let interval: NodeJS.Timeout;

    if (!isError) {
      interval = setInterval(() => {
        setFlowValue(flowContent!.data[index]);
        index = (index + 1) % flowContent!.data.length;
      }, intervalTime);
    }

    return () => clearInterval(interval);
  }, [flowContent, isError]);

  return (
    <Card className={cn(className, 'flex flex-col bg-amber-100 text-amber-500')}>
      {!isError && (isLoading || flowValue === undefined) ? (
        <LoadingText text={t('loading.default')} suffix='...' className='mx-auto my-auto py-4 !text-xsm text-amber-500' />
      ) : (
        <>
          <section className='flex w-full items-center space-x-2 rounded-md rounded-b-none bg-amber-200 p-2'>
            <div>
              <ChartLine size={16} strokeWidth={2} className='stroke-amber-500' />
            </div>
            <span className='text-xsm font-semibold uppercase leading-none'>{t('statistics.appointments.title')}</span>
          </section>
          {flowValue?.count && (
            <div className='flex flex-col items-center p-4 font-semibold'>
              <NumberFlowGroup>
                {flowValue.count && (
                  <div className='flex items-center space-x-2'>
                    <NumberFlow className='fill-amber-500 text-3xl text-amber-500' format={{ style: 'decimal' }} value={flowValue.count.value} />
                    <span className='text-base font-light'>{t(`statistics.appointments.${flowValue.count.label}`)}</span>
                  </div>
                )}
                <div className='flex items-center space-x-2'>
                  <NumberFlow
                    className={cn(
                      '!text-xsm',
                      flowValue.diff ? (flowValue.diff < 0 ? 'fill-rose-500 text-rose-500' : 'fill-emerald-500 text-emerald-500') : 'text-amber-500',
                    )}
                    value={flowValue.diff ?? flowValue.last.value}
                    format={{ style: 'decimal', maximumFractionDigits: 1 }}
                    locales={i18n.resolvedLanguage}
                    prefix={flowValue.diff && flowValue.diff > 0 ? '+' : ''}
                    suffix={flowValue.diff || flowValue.diff === 0 ? '%' : ''}
                  />
                  <div className='flex items-center'>
                    {flowValue.diff ? (
                      <>
                        <span>{flowValue.diff > 0 && <TrendingUp size={12} strokeWidth={2} className='mr-1 stroke-emerald-500' />}</span>
                        <span>{flowValue.diff < 0 && <TrendingDown size={12} strokeWidth={2} className='mr-1 stroke-rose-500' />}</span>
                      </>
                    ) : (
                      <span>{flowValue.diff === 0 && <MoveRight size={12} strokeWidth={2} className='mr-1 stroke-amber-500' />}</span>
                    )}
                    {flowValue.last && <span className='text-xs font-light'>{t(`statistics.appointments.${flowValue.last.label}`)}</span>}
                  </div>
                </div>
              </NumberFlowGroup>
            </div>
          )}
        </>
      )}
      {isError && <span className='mx-auto my-auto !text-xsm'>{error.message}</span>}
    </Card>
  );
}
