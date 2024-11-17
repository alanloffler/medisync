// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// React component
export function Statistic({ children, content, error, isLoading, path, title, value1, value2 }: IStatistic) {
  const targetNumber = value1?.toString();
  const [displayedDigits, setDisplayedDigits] = useState<number[]>(new Array(targetNumber?.length).fill(0));
  const navigate = useNavigate();

  useEffect(() => {
    if (targetNumber === undefined) return;

    const counters = new Array(targetNumber.length).fill(0);
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function updateDigit(index: number) {
      if (counters[index] < 30) {
        setDisplayedDigits((prev) => {
          const updatedDigits = [...prev];
          updatedDigits[index] = randomNumber();
          return updatedDigits;
        });

        counters[index]++;

        if (counters[index] <= 20) {
          timeouts[index] = setTimeout(() => updateDigit(index), 50);
        } else {
          const newDelay = 50 + (counters[index] - 20) * 30;
          timeouts[index] = setTimeout(() => updateDigit(index), newDelay);
        }
      } else {
        setDisplayedDigits((prev) => {
          const updatedDigits = [...prev];
          updatedDigits[index] = parseInt(targetNumber![index]);
          return updatedDigits;
        });

        clearTimeout(timeouts[index]);
      }
    }

    for (let i = 0; i < targetNumber.length; i++) {
      updateDigit(i);
    }

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [targetNumber]);

  function randomNumber(): number {
    return Math.floor(Math.random() * 10);
  }

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
              <span className='text-xsm font-semibold uppercase leading-none text-dark-default'>{title}</span>
              <div>{children}</div>
            </section>
            <CardContent className='space-y-2 p-4 pt-0'>
              <div className='flex flex-row items-center text-3xl font-bold text-dark-default'>
                {displayedDigits.map((digit, index) => (
                  <span key={index}>{digit}</span>
                ))}
              </div>
              <p className='text-left text-xs text-dark-default'>{`${value2} ${content}`}</p>
            </CardContent>
          </>
        )}
      </Card>
    </motion.button>
  );
}
