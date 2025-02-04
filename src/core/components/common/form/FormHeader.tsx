// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  className?: string;
  step?: number;
  title: string;
}
// React component
export function FormHeader({ className, step, title }: IProps) {
  return (
    <header className={cn('flex items-center space-x-3 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600', className)}>
      {step && <div className='flex h-5 w-5 items-center justify-center rounded-full bg-slate-500 text-xs text-slate-50'>{step}</div>}
      <h5>{title}</h5>
    </header>
  );
}
