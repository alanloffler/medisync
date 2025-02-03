// External imports
import { ReactNode } from 'react';
// Imports
import { cn } from '@lib/utils';
// Interface
interface IProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title: string;
}
// React component
export function CardHeaderPrimary({ className, children, icon, title }: IProps) {
  return (
    <main className={cn('flex items-center rounded-t-lg bg-primary p-4 text-lg font-semibold text-white', className)}>
      <div className='flex items-center space-x-4'>
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </main>
  );
}
