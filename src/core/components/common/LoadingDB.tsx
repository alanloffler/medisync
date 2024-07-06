import { APP_CONFIG } from '@/config/app.config';
import { cn } from '@/lib/utils';

export function LoadingDB({ text, color, className }: { text?: string; color?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-sm font-medium text-slate-500', className)}>
      <svg width={APP_CONFIG.loadingDB.settings.size} height={APP_CONFIG.loadingDB.settings.size} viewBox='0 0 24 24' className={cn('fill-primary', color)}>
        <path d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'>
          <animateTransform attributeName='transform' type='rotate' dur={APP_CONFIG.loadingDB.settings.duration} values='0 12 12;360 12 12' repeatCount='indefinite' />
        </path>
      </svg>
      <span>{text || APP_CONFIG.loadingDB.defaultText}</span>
    </div>
  );
}
