// Icons: https://lucide.dev/icons/
import { ChevronDown, ChevronRight, ChevronUp, X } from 'lucide-react';
// External components
import { ChartContainer } from '@core/components/ui/chart';
import { Pie, PieChart } from 'recharts';
// https://shadcn.com/docs/components
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@core/components/ui/hover-card';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IAppoAttendance } from '@appointments/interfaces/appos-attendance.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EStatus } from '@appointments/enums/status.enum';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function ApposAttendance() {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { i18n, t } = useTranslation();

  const colors = [
    { attendance: EStatus.ATTENDED, class: 'text-emerald-400', hsl: 'oklch(0.765 0.177 163.223)' },
    { attendance: EStatus.NOT_ATTENDED, class: 'text-rose-400', hsl: 'oklch(0.712 0.194 13.428)' },
    { attendance: EStatus.NOT_STATUS, class: 'text-slate-400', hsl: 'oklch(0.704 0.04 256.788)' },
    { attendance: EStatus.WAITING, class: 'text-amber-400', hsl: 'oklch(0.828 0.189 84.429)' },
  ];

  const { data, error, isError, isLoading } = useQuery<IResponse<IAppoAttendance[]>, Error>({
    queryKey: ['appointments', 'attendance'],
    queryFn: async () => await AppointmentApiService.getAttendance(),
    select: (chart: IResponse) => {
      return chart.data.map((item: IAppoAttendance) => ({
        ...item,
        fill: colors.find((color) => color.attendance === item.attendance)?.hsl,
      }));
    },
  });

  useEffect(() => {
    addNotification({ type: 'error', message: error?.message });
  }, [addNotification, error?.message, isError]);

  if (isLoading) return <LoadingText text={t('loading.default')} suffix='...' className='text-xsm' />;

  if (isError) return <InfoCard className='justify-start p-0' type='error' text={error.message} />;

  if (Array.isArray(data))
    return (
      <main className='flex flex-row items-center gap-1 text-xsm font-normal text-foreground'>
        <div className='my-auto flex flex-col' style={{ height: 45, width: 45 }}>
          <HoverCard>
            <HoverCardTrigger>
              <ChartContainer config={{}} className='aspect-square max-h-[250px]'>
                <PieChart className='!cursor-pointer'>
                  <Pie data={data} dataKey='value' nameKey='attendance' innerRadius={8} />
                </PieChart>
              </ChartContainer>
            </HoverCardTrigger>
            <HoverCardContent className='w-fit p-2 text-xs'>
              <div className='flex flex-col gap-1'>
                <section className='flex items-center gap-1'>
                  <ChevronUp size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.ATTENDED)?.class}`} />
                  <Trans
                    i18nKey='statistics.attendance.attendance'
                    values={{ count: i18n.format(data[0].value, 'number', i18n.resolvedLanguage) }}
                    components={{
                      small: <small />,
                    }}
                    parent={'span'}
                  ></Trans>
                </section>
                <section className='flex flex-col'>
                  <div className='flex items-center gap-1'>
                    <ChevronDown size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.NOT_ATTENDED)?.class}`} />
                    <Trans
                      i18nKey='statistics.attendance.nonAttendance'
                      values={{ count: i18n.format(data[1].value, 'number', i18n.resolvedLanguage) }}
                      components={{
                        small: <small />,
                      }}
                      parent={'span'}
                    ></Trans>
                  </div>
                </section>
                <section className='flex flex-col'>
                  <div className='flex items-center gap-1'>
                    <ChevronRight size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.WAITING)?.class}`} />
                    <Trans
                      i18nKey='statistics.attendance.waiting'
                      values={{ count: i18n.format(data[3].value, 'number', i18n.resolvedLanguage) }}
                      components={{
                        small: <small />,
                      }}
                      parent={'span'}
                    ></Trans>
                  </div>
                </section>
                <section className='flex flex-col'>
                  <div className='flex items-center gap-1'>
                    <X size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.NOT_STATUS)?.class}`} />
                    <Trans
                      i18nKey='statistics.attendance.notStatus'
                      values={{ count: i18n.format(data[2].value, 'number', i18n.resolvedLanguage) }}
                      components={{
                        small: <small />,
                      }}
                      parent={'span'}
                    ></Trans>
                  </div>
                </section>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className='flex flex-col'>
          <section className='flex items-center gap-1'>
            <ChevronUp size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.ATTENDED)?.class}`} />
            <Trans
              i18nKey='statistics.attendance.attendance'
              values={{ count: i18n.format(data[0].value, 'number', i18n.resolvedLanguage) }}
              components={{
                small: <small />,
              }}
              parent={'span'}
            ></Trans>
          </section>
          <section className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <ChevronDown size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.NOT_ATTENDED)?.class}`} />
              <Trans
                i18nKey='statistics.attendance.nonAttendance'
                values={{ count: i18n.format(data[1].value, 'number', i18n.resolvedLanguage) }}
                components={{
                  small: <small />,
                }}
                parent={'span'}
              ></Trans>
            </div>
          </section>
          {/* <section className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <ChevronRight size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.WAITING)?.class}`} />
              <Trans
                i18nKey='statistics.attendance.waiting'
                values={{ count: i18n.format(data[3].value, 'number', i18n.resolvedLanguage) }}
                components={{
                  small: <small />,
                }}
                parent={'span'}
              ></Trans>
            </div>
          </section>
          <section className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <X size={17} strokeWidth={3} className={`${colors.find((item) => item.attendance === EStatus.NOT_STATUS)?.class}`} />
              <Trans
                i18nKey='statistics.attendance.notStatus'
                values={{ count: i18n.format(data[2].value, 'number', i18n.resolvedLanguage) }}
                components={{
                  small: <small />,
                }}
                parent={'span'}
              ></Trans>
            </div>
          </section> */}
        </div>
      </main>
    );
}
