import { cn } from '@/lib/utils';

export function Steps({ text, step, className }: { text: string; step: string; className?: string }) {
  return (
    <div className='flex flex-row items-center space-x-4'>
      <span
        className={cn(
          'flex h-8 w-8 flex-col items-center justify-center rounded-full bg-primary/20 text-xl font-semibold text-primary shadow-sm border border-primary/10',
          className,
        )}
      >
        {step}
      </span>
      <h1 className='font-medium'>{text}</h1>
    </div>
  );
}
