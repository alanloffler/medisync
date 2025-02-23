// Icons: https://lucide.dev/icons/
import { ChevronDown, ChevronUp } from 'lucide-react';
// External imports
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

  return (
    <main className='space-y-1 text-sm font-normal text-foreground'>
      <section className='flex items-center gap-1'>
        <ChevronUp size={17} strokeWidth={3} className='text-emerald-400' />
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
          <ChevronDown size={17} strokeWidth={3} className='text-rose-400' />
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
    </main>
  );
}
