// Components
import { Card } from '@/core/components/ui/card';
import { cn } from '@/lib/utils';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
// Interface
interface IInfoCard {
  title: string;
  description: string;
  type: 'error' | 'success' | 'warning';
  className?: string;
}
// React component
export function InfoCard({ title, description, type, className }: IInfoCard) {
  const borderColor = type === 'error' ? 'border-red-400' : type === 'success' ? 'border-green-400' : 'border-yellow-400';
  const strokeColor = type === 'error' ? 'stroke-red-400' : type === 'success' ? 'stroke-green-400' : 'stroke-yellow-400';

  return (
    <Card className={cn('flex flex-row items-center space-x-4 p-4', className)}>
      <div className={cn('flex h-full flex-col justify-center border-r-2 pr-4', borderColor)}>
        {type === 'error' && <CircleX className={cn('h-8 w-8', strokeColor)} strokeWidth={2} />}
        {type === 'success' && <CircleCheck className={cn('h-8 w-8', strokeColor)} strokeWidth={2} />}
        {type === 'warning' && <CircleAlert className={cn('h-8 w-8', strokeColor)} strokeWidth={2} />}
      </div>
      <div className='flex flex-col'>
        <h1 className='text-lg font-bold'>{title}</h1>
        <div>{description}</div>
      </div>
    </Card>
  );
}
