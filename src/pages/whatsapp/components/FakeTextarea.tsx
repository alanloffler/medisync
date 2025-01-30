// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  disabled?: boolean;
  text: string;
}
// React component
export function FakeTextarea({ text, disabled }: IProps) {
  return (
    <main className={cn('flex min-h-[80px] w-full rounded-md bg-slate-100/70 px-3 py-2 text-sm', disabled && 'cursor-not-allowed opacity-50')}>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </main>
  );
}
