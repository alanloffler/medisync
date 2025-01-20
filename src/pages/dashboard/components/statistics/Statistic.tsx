// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { CountUp } from '@core/components/common/CountUp';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// React component
export function Statistic({ children, content, error, isLoading, path, title, value1, value2 }: IStatistic) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const animation = {
    item: {
      initial: { scale: 1, border: '1px solid transparent' },
      animate: { scale: 1.05, border: '1px solid #e2e8f0', transition: { type: 'spring', stiffness: 800, damping: 20, duration: 0.2, delay: 0 } }, // slate-200
    },
  };

  return (
    <motion.button
      className='rounded-lg'
      onClick={() => path && navigate(path)}
      initial='initial'
      animate='initial'
      whileHover='animate'
      variants={animation.item}
    >
      <Card className='h-full'>
        {isLoading ? (
          <LoadingDB size='box' iconSize={32} empty className='relative top-1/2 -translate-y-1/2 p-6 py-6' />
        ) : error ? (
          <InfoCard text={error.message} type='error' className='relative top-1/2 -translate-y-1/2 p-6 text-xsm font-light text-dark-default' />
        ) : (
          <>
            <section className='flex flex-row items-center justify-between p-4 pb-2'>
              <span className='text-xsm font-semibold uppercase leading-none text-slate-700'>{t(title)}</span>
              <div>{children}</div>
            </section>
            <CardContent className='space-y-2 p-4 pt-0'>
              <CountUp from={0} to={Number(value1)} className='flex flex-row items-center text-3xl font-bold text-dark-default' />
              <p className='text-left text-xs text-dark-default'>{t(content, { count: Number(value2) })}</p>
            </CardContent>
          </>
        )}
      </Card>
    </motion.button>
  );
}
