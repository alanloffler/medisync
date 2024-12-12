// Icons: https://lucide.dev/icons
import { ChartLine, TrendingDown, TrendingUp } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// https://number-flow.barvian.me/
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
// External imports
import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';
// import { useTranslation } from 'react-i18next';
// React component
export function AppoFlowCard() {
  const [flowValue, setFlowValue] = useState<{ value: number; label: string; diff: number; diffLabel: string }>({
    value: 0,
    label: '',
    diff: 0,
    diffLabel: '',
  });
  // const { t } = useTranslation();

  useEffect(() => {
    const flowContent = [
      { value: 58, label: 'en total', diff: 0.07, diffLabel: 'que el mes pasado' },
      { value: -12, label: 'esta semana', diff: -0.02, diffLabel: 'que la semana pasada' },
      { value: 4, label: 'hoy', diff: 0.01, diffLabel: 'que ayer' },
    ];

    let index: number = 0;

    const interval = setInterval(() => {
      setFlowValue(flowContent[index]);
      index = (index + 1) % flowContent.length;
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className='flex space-x-8 bg-amber-200 px-6 py-4 text-amber-600'>
      <section className='my-auto'>
        <ChartLine size={20} strokeWidth={2} className='stroke-amber-600' />
      </section>
      <NumberFlowGroup>
        <div className='flex flex-col font-semibold'>
          <div className='flex items-center space-x-2'>
            <NumberFlow className='fill-amber-600 text-2xl text-amber-600' format={{ style: 'decimal' }} value={flowValue.value} />
            <span className='text-base font-light'>{flowValue.label}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <NumberFlow
              className={cn('!text-xsm', flowValue.diff < 0 ? 'fill-rose-500 text-rose-500' : 'fill-emerald-500 text-emerald-500')}
              format={{ style: 'percent' }}
              value={flowValue.diff}
              prefix={flowValue.diff > 0 ? '+' : ''}
            />
            <div className='flex items-center space-x-1'>
              <span>
                {flowValue.diff > 0 ? (
                  <TrendingUp size={12} strokeWidth={2} className='stroke-emerald-500' />
                ) : (
                  <TrendingDown size={12} strokeWidth={2} className='stroke-rose-500' />
                )}
              </span>
              <span className='text-xs font-light'>{flowValue.diffLabel}</span>
            </div>
          </div>
        </div>
      </NumberFlowGroup>
    </Card>
  );
}
