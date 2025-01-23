// External imports
import { cva } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
// Imports
import { APP_CONFIG } from '@config/app.config';
import { cn } from '@lib/utils';
// Loader variants
const loadingDBVariants = cva('flex items-center justify-center gap-2 text-sm font-normal', {
  variants: {
    variant: {
      button: 'mx-auto bg-transparent text-white [&>svg]:fill-white',
      card: 'mx-auto bg-white rounded-lg shadow-sm',
      default: 'mx-auto bg-transparent',
      primary: 'mx-auto bg-primary/25 rounded-lg text-slate-900',
    },
    size: {
      big: 'px-6 py-6 [&_svg]:w-6 [&_svg]:h-6',
      box: 'w-fit px-4 py-4',
      default: 'w-fit',
      md: 'w-fit px-4 py-2',
      xs: 'w-fit px-2 py-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
// Interface
interface ILoadingDB {
  absolute?: boolean;
  className?: string;
  empty?: boolean;
  iconSize?: number;
  size?: 'big' | 'box' | 'default' | 'xs' | 'md';
  spinnerColor?: string;
  text?: string;
  variant?: 'button' | 'card' | 'default' | 'primary';
}
// React component
export function LoadingDB({ absolute, className, empty, iconSize, size, spinnerColor, text, variant }: ILoadingDB) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        `group ${absolute && 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}`,
        loadingDBVariants({ variant, size, className }),
      )}
    >
      <svg
        width={iconSize || APP_CONFIG.loadingDB.size}
        height={iconSize || APP_CONFIG.loadingDB.size}
        viewBox='0 0 24 24'
        className={cn('fill-primary', spinnerColor)}
      >
        <path d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'>
          <animateTransform
            attributeName='transform'
            type='rotate'
            dur={APP_CONFIG.loadingDB.duration}
            values='0 12 12;360 12 12'
            repeatCount='indefinite'
          />
        </path>
      </svg>
      {!empty && <span>{text || t('loading.default')}</span>}
    </div>
  );
}
