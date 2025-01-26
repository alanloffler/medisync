// External imports
import { ReactNode } from 'react';
// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  children?: ReactNode;
  className?: string;
  title: string;
}
// React component
export function CardHeaderSecondary({ className, children, title }: IProps) {
  return (
    <main className={cn('flex items-center space-x-4 rounded-t-lg border-b p-4 text-lg font-semibold', className)}>
      {children}
      <span>{title}</span>
    </main>
  );
}
