// Icons: https://lucide.dev/icons/
import { Database } from 'lucide-react';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  className?: string;
  text: string;
  value?: number;
}
// React component
export function DBCount({ className, text, value }: IProps) {
  const { t } = useTranslation();

  return (
    <section className={cn(className, 'flex items-center space-x-1 !text-xsm text-slate-400')}>
      <Database size={16} strokeWidth={2} className='text-orange-400' />
      <span>{t(text, { count: value })}</span>
    </section>
  );
}
