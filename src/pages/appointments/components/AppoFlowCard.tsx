// Icons: https://lucide.dev/icons
import { ChartLine } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// https://number-flow.barvian.me/
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
// External imports
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// React component
export function AppoFlowCard() {
  const [flowValue, setFlowValue] = useState<{ value: number; label: string }>({ value: 0, label: '' });
  const { t } = useTranslation();

  useEffect(() => {
    const flowContent = [
      { value: 58, label: 'en total' },
      { value: -12, label: 'esta semana' },
      { value: 4, label: 'hoy' },
    ];
    let index = 0;

    const interval = setInterval(() => {
      setFlowValue(flowContent[index]);
      index = (index + 1) % flowContent.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className='space-y-4 bg-amber-200 p-4 pb-8 text-amber-600'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xsm font-semibold uppercase'>{t('pageTitle.appointments')}</h2>
        <ChartLine size={20} strokeWidth={2} className='stroke-amber-600' />
      </div>
      <NumberFlowGroup>
        <div className='flex flex-col items-center justify-center space-y-2 font-semibold'>
          <div className={'flex items-center space-x-2'}>
            <NumberFlow
              className={clsx('text-3xl', flowValue.value < 0 ? 'fill-rose-500 text-rose-500' : 'fill-emerald-500 text-emerald-500')}
              format={{ style: 'decimal' }}
              value={flowValue.value}
              // prefix={flowValue.value > 0 ? '+' : ''}
            />
            <span className='text-base font-light'>{flowValue.label}</span>
          </div>
          {/* <div className='flex items-center space-x-2'>
          <NumberFlow value={flowValue.value} suffix='' className='text-2xl font-semibold' />
          <span className='font-light'>{flowValue.label}</span>
        </div> */}
        </div>
      </NumberFlowGroup>
    </Card>
  );
}
