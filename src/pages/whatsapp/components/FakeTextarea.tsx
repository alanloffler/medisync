// Imports
import { cn } from '@lib/utils';
import { forwardRef } from 'react';
// Interface
interface IProps {
  disabled?: boolean;
  text: string;
}
// React component
export const FakeTextarea = forwardRef<HTMLElement, IProps>(({ text, disabled }, ref) => {
  return (
    <main ref={ref} className={cn('flex min-h-[80px] w-full rounded-md bg-slate-100/70 px-3 py-2 text-sm', disabled && 'cursor-not-allowed opacity-50')}>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </main>
  );
});
