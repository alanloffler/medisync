// External imports
import { ReactNode } from 'react';
// Interface
interface IProps {
  children: ReactNode;
  title: string;
}
// React component
export function CardHeaderPrimary({ title, children }: IProps) {
  return (
    <main className='flex items-center space-x-4 rounded-t-lg bg-primary p-4 text-lg font-semibold text-white'>
      {children}
      <span>{title}</span>
    </main>
  );
}
