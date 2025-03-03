// Icons: https://lucide.dev/icons/
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
// External imports
import { cva } from 'class-variance-authority';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import { cn } from '@lib/utils';
// Variants
const infoCardVariants = cva('flex flex-row items-center justify-center space-x-2', {
  variants: {
    variant: {
      default: 'font-normal text-sm',
      warning: 'bg-amber-100 !p-3 text-sm w-fit rounded-lg !text-amber-600',
    },
    size: {
      default: 'p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
// React component
export function InfoCard({ className, iconSize, size, text, type, variant }: IInfoCard) {
  const strokeColor: string = type === 'error' ? 'stroke-rose-400' : type === 'success' ? 'stroke-green-400' : 'stroke-yellow-400';
  const defaultIconSize: number = 20;

  return (
    <div className={cn(infoCardVariants({ className, size, variant }))}>
      <div className='flex h-full flex-col justify-center'>
        {type === 'error' && <CircleX className={strokeColor} size={iconSize ?? defaultIconSize} strokeWidth={2} />}
        {type === 'success' && <CircleCheck className={strokeColor} size={iconSize ?? defaultIconSize} strokeWidth={2} />}
        {/* {type === 'warning' && <CircleAlert className={strokeColor} size={iconSize ?? defaultIconSize} strokeWidth={2} />} */}
        {type === 'warning' && <CircleAlert size={iconSize ?? defaultIconSize} strokeWidth={2} />}
      </div>
      <div className='flex flex-col'>
        {/* <span className={type === 'error' ? 'text-red-400' : 'text-foreground'}>{text}</span> */}
        <span>{text}</span>
      </div>
    </div>
  );
}
