import { cn } from '@/lib/utils';

export function Loading({ text, size, duration, className }: { text: string; size: number; duration: number; className: string }) {
  return (
    <div className={cn('absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center rounded-md text-center shadow-sm', className)}>
      <svg width={size} height={size} viewBox='0 0 24 24'>
        <path d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'>
          <animateTransform attributeName='transform' type='rotate' dur={duration} values='0 12 12;360 12 12' repeatCount='indefinite' />
        </path>
      </svg>
      <div className='flex font-medium'>{text}</div>
    </div>
  );
}
