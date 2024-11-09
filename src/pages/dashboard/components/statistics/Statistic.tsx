// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// External imports
import { useEffect, useState } from 'react';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// Imports
import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// React component
export function Statistic({ children, content, error, isLoading, title, value1, value2 }: IStatistic) {
  const targetNumber = value1?.toString();
  const [displayedDigits, setDisplayedDigits] = useState<number[]>(new Array(targetNumber?.length).fill(0));

  useEffect(() => {
    function randomNumber(): number {
      return Math.floor(Math.random() * 10);
    }

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

  return (
    <Card>
      {isLoading ? (
        <LoadingDB size='box' iconSize={32} empty className='relative top-1/2 -translate-y-1/2 p-6 py-6' />
      ) : error ? (
        <InfoCard text={error.message} type='error' className='relative top-1/2 -translate-y-1/2 p-6 text-xsm font-light text-dark-default' />
      ) : (
        <>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='flex bg-primary px-2 py-1 text-primary-foreground'>
              <span className='text-xsm font-medium'>{title}</span>
            </CardTitle>
            {children}
          </CardHeader>
          <CardContent>
            <>
              <div className='flex flex-row items-center text-2xl font-bold text-dark-default'>
                {displayedDigits.map((digit, index) => (
                  <span key={index}>{digit}</span>
                ))}
              </div>
              <p className='text-xs text-dark-default'>{`${value2} ${content}`}</p>
            </>
          </CardContent>
        </>
      )}
    </Card>
  );
}