// Icons: https://lucide.dev/icons/
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
// External imports
import { cva } from 'class-variance-authority';
// Imports
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import { cn } from '@lib/utils';
// Variants
const infoCardVariants = cva('flex flex-row items-center mx-auto justify-center space-x-2 font-normal', {
  variants: {
    variant: {
      default: 'w-fit',
      error: 'w-fit rounded-lg bg-rose-100 p-3 pr-3.5 !text-rose-500 [&_svg]:text-rose-500',
      success: 'w-fit rounded-lg bg-emerald-100 p-3 pr-3.5 !text-emerald-500 [&_svg]:text-emerald-500',
      warning: 'w-fit rounded-lg bg-amber-100 p-3 pr-3.5 !text-amber-500 [&_svg]:text-amber-500',
    },
    size: {
      default: 'text-base [&_svg]:h-[20px] [&_svg]:w-[20px]',
      sm: 'text-sm [&_svg]:h-[18px] [&_svg]:w-[18px]',
      xsm: 'text-xsm [&_svg]:h-[16px] [&_svg]:w-[16px]',
      xs: 'text-xs [&_svg]:h-[14px] [&_svg]:w-[14px]',
    },
    type: {
      flat: 'p-0 bg-transparent !text-foreground',
      'flat-colored': 'p-0 bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'xsm',
  },
});
// React component
export function InfoCard({ className, size, text, type, variant }: IInfoCard) {
  return (
    <div className={cn(infoCardVariants({ className, size, type, variant }))}>
      <div className='flex h-full flex-col justify-center'>
        {variant === 'error' && <CircleX strokeWidth={2} />}
        {variant === 'success' && <CircleCheck strokeWidth={2} />}
        {variant === 'warning' && <CircleAlert strokeWidth={2} />}
      </div>
      <div className='flex flex-col text-left'>
        <span>{text}</span>
      </div>
    </div>
  );
}
