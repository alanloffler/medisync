// Icons: https://lucide.dev/icons/
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import { cn } from '@lib/utils';
// React component
export function InfoCard({ iconSize, text, type, className }: IInfoCard) {
  const strokeColor: string = type === 'error' ? 'stroke-rose-400' : type === 'success' ? 'stroke-green-400' : 'stroke-yellow-400';
  const defaultIconSize: number = 20;

  return (
    <div className={cn('flex flex-row items-center justify-center space-x-2 text-sm font-normal', className)}>
      <div className='flex h-full flex-col justify-center'>
        {type === 'error' && <CircleX className={strokeColor} size={iconSize ?? defaultIconSize} strokeWidth={2} />}
        {type === 'success' && <CircleCheck className={strokeColor} size={iconSize ?? defaultIconSize} strokeWidth={2} />}
        {type === 'warning' && <CircleAlert className={strokeColor} size={iconSize ?? defaultIconSize} strokeWidth={2} />}
      </div>
      <div className='flex flex-col'>
        <span className={type === 'error' ? 'text-red-400' : 'text-foreground'}>{text}</span>
      </div>
    </div>
  );
}
