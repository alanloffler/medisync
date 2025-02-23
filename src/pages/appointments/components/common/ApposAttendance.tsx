// Icons: https://lucide.dev/icons/
import { ChevronDown, ChevronUp } from 'lucide-react';
// External imports
import { ChartContainer } from '@core/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import { Trans, useTranslation } from 'react-i18next';
// Interface
interface IProps {
  data: {
    positive: number;
    negative: number;
  };
}
// React component
export function ApposAttendance({ data }: IProps) {
  const { i18n } = useTranslation();

  const colors = {
    positive: { class: 'text-emerald-400', hsl: 'hsl(158.1 64.4% 51.6%)' },
    negative: { class: 'text-rose-400', hsl: 'hsl(351.3 94.5% 71.4%)' },
  };

  const chartData = [
    { attendance: 'Attendance', value: data.positive, fill: colors.positive.hsl },
    { attendance: 'Non-attendance', value: data.negative, fill: colors.negative.hsl },
  ];

  return (
    <main className='flex flex-row items-center gap-2 text-sm font-normal text-foreground'>
      <div className='my-auto flex flex-col' style={{ height: 45, width: 45 }}>
        <ChartContainer config={{}} className='aspect-square max-h-[250px]'>
          <PieChart>
            <Pie data={chartData} dataKey='value' nameKey='attendance' innerRadius={8} />
          </PieChart>
        </ChartContainer>
      </div>
      <div className='flex flex-col'>
        <section className='flex items-center gap-1'>
          <ChevronUp size={17} strokeWidth={3} className={`${colors.positive.class}`} />
          <Trans
            i18nKey='statistics.attendance.attendance'
            values={{ count: i18n.format(data.positive, 'number', i18n.resolvedLanguage) }}
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
              values={{ count: i18n.format(data.negative, 'number', i18n.resolvedLanguage) }}
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
