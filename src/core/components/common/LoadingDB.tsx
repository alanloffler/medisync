import { APP_CONFIG } from '@/config/app.config';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const loadingDBVariants = cva('flex items-center justify-center gap-2 text-sm font-medium text-slate-500', {
  variants: {
    variant: {
      card: 'mx-auto bg-white rounded-lg shadow-sm',
      default: 'mx-auto bg-transparent',
      primary: 'mx-auto bg-primary/25 rounded-lg text-slate-900',
    },
    size: {
      default: 'w-fit px-3 py-2',
      xs: 'w-fit px-2 py-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface LoadingProps extends React.ButtonHTMLAttributes<HTMLElement>, VariantProps<typeof loadingDBVariants> {
  asChild?: boolean;
}

export function LoadingDB({
  text,
  className,
  variant,
  size,
}: {
  text?: string;
  className?: string;
  variant?: 'card' | 'default' | 'primary';
  size?: 'default' | 'xs';
}) {
  return (
    <div className={cn(loadingDBVariants({ variant, size, className }))}>
      <svg width={APP_CONFIG.loadingDB.settings.size} height={APP_CONFIG.loadingDB.settings.size} viewBox='0 0 24 24' className='fill-primary'>
        <path d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'>
          <animateTransform
            attributeName='transform'
            type='rotate'
            dur={APP_CONFIG.loadingDB.settings.duration}
            values='0 12 12;360 12 12'
            repeatCount='indefinite'
          />
        </path>
      </svg>
      <span>{text || APP_CONFIG.loadingDB.defaultText}</span>
    </div>
  );
}
