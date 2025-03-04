// Icons: https://lucide.dev/icons/
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
// External imports
import { cva } from 'class-variance-authority';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import { cn } from '@lib/utils';
// Variants
const infoCardVariants = cva('flex flex-row items-center justify-center space-x-2 font-normal', {
  variants: {
    variant: {
      default: 'w-fit p-0',
      error: 'w-fit rounded-lg bg-rose-100 p-3 pr-3.5 text-rose-500 [&_svg]:text-rose-500',
      success: 'w-fit rounded-lg bg-emerald-100 p-3 pr-3.5 text-emerald-500 [&_svg]:text-emerald-500',
      warning: 'w-fit rounded-lg bg-amber-100 p-3 pr-3.5 text-amber-500 [&_svg]:text-amber-500',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      xsm: '!text-xsm',
      xs: 'text-xs',
    },
    type: {
      flat: 'p-0 bg-transparent text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
// React component
export function InfoCard({ className, size, text, type, variant }: IInfoCard) {
  let iconSize: number = 20;
  if (size === 'sm') iconSize = 18;
  if (size === 'xsm') iconSize = 16;
  if (size === 'xs') iconSize = 14;

  return (
    <div className={cn(infoCardVariants({ className, size, type, variant }))}>
      <div className='flex h-full flex-col justify-center'>
        {variant === 'error' && <CircleX size={iconSize} strokeWidth={2} />}
        {variant === 'success' && <CircleCheck size={iconSize} strokeWidth={2} />}
        {variant === 'warning' && <CircleAlert size={iconSize} strokeWidth={2} />}
      </div>
      <div className='flex flex-col'>
        <span>{text}</span>
      </div>
    </div>
  );
}
