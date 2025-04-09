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
import { useMediaQuery } from '@core/hooks/useMediaQuery';
// React component
export function Statistic({ children, error, isLoading, item, value1, value2 }: IStatistic) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 767px)');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const animation = {
    item: {
      initial: { scale: 1 },
      animate: { scale: 1.05, transition: { type: 'spring', stiffness: 800, damping: 20, duration: 0.2, delay: 0 } }, // slate-200
    },
  };

  return (
    <motion.button
      className='rounded-lg'
      onClick={() => {
        item.path && navigate(item.path);
      }}
      initial='initial'
      animate='initial'
      whileHover={isSmallDevice ? '' : 'animate'}
      variants={animation.item}
    >
      <Card className='h-full'>
        {isLoading ? (
          <LoadingDB size='box' iconSize={32} empty className='relative top-1/2 -translate-y-1/2 p-6 py-6' />
        ) : error ? (
          <InfoCard
            className='relative top-1/2 -translate-y-1/2'
            size='xsm'
            text={error.response?.data.message}
            type='flat-colored'
            variant='error'
          />
        ) : (
          <>
            <section className='flex flex-row items-center justify-between p-4 pb-2'>
              <span className='text-xs font-semibold uppercase leading-none text-slate-400'>{t(item.title)}</span>
              <div>{children}</div>
            </section>
            <CardContent className='space-y-2 p-4 pt-0'>
              <CountUp from={0} to={Number(value1)} className='flex flex-row items-center text-3xl font-bold text-dark-default' />
              <p className='text-left text-xs text-dark-default'>{t(item.content, { count: Number(value2) })}</p>
            </CardContent>
          </>
        )}
      </Card>
    </motion.button>
  );
}
