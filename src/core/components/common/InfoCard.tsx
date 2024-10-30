// Icons: https://lucide.dev/icons/
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import { cn } from '@lib/utils';
// React component
export function InfoCard({ text, type, className }: IInfoCard) {
  const strokeColor: string = type === 'error' ? 'stroke-red-400' : type === 'success' ? 'stroke-green-400' : 'stroke-yellow-400';

  return (
    <div className={cn('flex flex-row items-center justify-center space-x-2 p-2', className)}>
      <div className='flex h-full flex-col justify-center'>
        {type === 'error' && <CircleX className={cn('h-5 w-5', strokeColor)} strokeWidth={2} />}
        {type === 'success' && <CircleCheck className={cn('h-5 w-5', strokeColor)} strokeWidth={2} />}
        {type === 'warning' && <CircleAlert className={cn('h-5 w-5', strokeColor)} strokeWidth={2} />}
      </div>
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-slate-500'>{text}</span>
      </div>
    </div>
  );
}
