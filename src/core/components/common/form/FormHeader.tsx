// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  className?: string;
  title: string;
}
// React component
export function FormHeader({ className, title }: IProps) {
  return (
    <header className={cn('rounded-sm bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600', className)}>
      <h5>{title}</h5>
    </header>
  );
}
