// Icons: https://lucide.dev/icons/
import { ChevronDown, ChevronUp } from 'lucide-react';
// External components
import { ChartContainer } from '@core/components/ui/chart';
import { Pie, PieChart } from 'recharts';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IAppoAttendance } from '@appointments/interfaces/appos-attendance.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
// React component
export function ApposAttendance() {
  const { i18n } = useTranslation();

  const colors = {
    positive: { class: 'text-emerald-400', hsl: 'hsl(158.1 64.4% 51.6%)' },
    negative: { class: 'text-rose-400', hsl: 'hsl(351.3 94.5% 71.4%)' },
  };

  const { data, error, isError } = useQuery<IResponse<IAppoAttendance[]>, Error>({
    queryKey: ['appointments', 'attendance'],
    queryFn: async () => await AppointmentApiService.getAttendance(),
    select: (chart: IResponse) =>
      chart.data.map((item: IAppoAttendance, index: number) => ({
        ...item,
        fill: index === 0 ? colors.positive.hsl : colors.negative.hsl,
      })),
  });

  useEffect(() => {
    console.log(error);
  }, [error]);

  if (isError) return <InfoCard className='justify-start p-0' type='error' text={error.message} />;

  if (Array.isArray(data))
    return (
      <main className='flex flex-row items-center gap-2 text-sm font-normal text-foreground'>
        <div className='my-auto flex flex-col' style={{ height: 45, width: 45 }}>
          <ChartContainer config={{}} className='aspect-square max-h-[250px]'>
            <PieChart>
              <Pie data={data} dataKey='value' nameKey='attendance' innerRadius={8} />
            </PieChart>
          </ChartContainer>
        </div>
        <div className='flex flex-col'>
          <section className='flex items-center gap-1'>
            <ChevronUp size={17} strokeWidth={3} className={`${colors.positive.class}`} />
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
              <ChevronDown size={17} strokeWidth={3} className={`${colors.negative.class}`} />
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
        </div>
      </main>
    );
}
