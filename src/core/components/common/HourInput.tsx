import { Clock } from 'lucide-react';
import { Input } from '../ui/input';

export function HourInput() {
  return (
    <div className='flex space-x-2 items-center'>
      <Input type='number' pattern='/^[0-9]|[0-5][0-9]|6[0-3]$/' className='h-9' />
      <Input type='number' min={0} max={59} className='h-9' />
      <Clock size={42} />
    </div>
  );
}
