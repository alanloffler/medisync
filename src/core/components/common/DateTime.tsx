// Icons: https://lucide.dev/icons/
import { Calendar, Clock } from 'lucide-react';
// External imports
import { format } from '@formkit/tempo';
import { useTranslation } from 'react-i18next';
// Imports
import { cn } from '@lib/utils';
// Interface
interface IDateTime {
  className?: string;
  day: string;
  hour: string;
}
// React component
export function DateTime({ className, day, hour }: IDateTime) {
  const { i18n } = useTranslation();

  return (
    <section className={cn('flex flex-col gap-1 text-xs font-normal text-muted-foreground', className)}>
      <div className='flex items-center space-x-2'>
        <Calendar size={14} strokeWidth={2} className='text-sky-400' />
        <span>{format(day, i18n.resolvedLanguage === 'en' ? 'short' : 'DD/MM/YY', i18n.resolvedLanguage)}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <Clock size={14} strokeWidth={2} className='text-sky-400' />
        <span>{hour}</span>
      </div>
    </section>
  );
}
