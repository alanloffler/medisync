// External imports
import { ReactNode } from 'react';
// Interface
interface IProps {
  content: string | ReactNode;
  icon?: ReactNode;
  title?: string;
}
// React component
export function ElementInfo({ content, icon, title }: IProps) {
  return (
    <main className='flex items-center space-x-3 text-sm'>
      {icon && <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>{icon}</div>}
      <div className='flex flex-col space-y-0.5'>
        {title && <span className='text-xxs font-light text-slate-400'>{title}</span>}
        <span className='text-sm'>{content}</span>
      </div>
    </main>
  );
}
