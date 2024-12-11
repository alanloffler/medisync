// Icons: https://lucide.dev/icons/
import { Calendar, Clock } from 'lucide-react';
// External imports
import { format } from '@formkit/tempo';
import { useTranslation } from 'react-i18next';
// Interface
interface IDateTime {
  day: string;
  hour: string;
}
// React component
export function DateTime({ day, hour }: IDateTime) {
  const { i18n } = useTranslation();

  return (
    <section className='flex justify-center text-xsm font-normal'>
      <div className='flex items-center space-x-1 rounded-l-sm bg-indigo-200 p-1 pr-2 text-indigo-600'>
        <Calendar size={14} strokeWidth={2} />
        <span>{format(day, 'short', i18n.resolvedLanguage)}</span>
      </div>
      <div className='flex items-center space-x-1 rounded-r-sm bg-indigo-100 p-1 pr-2 text-indigo-600'>
        <Clock size={14} strokeWidth={2} />
        <span>{hour}</span>
      </div>
    </section>
  );
}
