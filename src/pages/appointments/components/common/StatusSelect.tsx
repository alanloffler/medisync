// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@core/components/ui/select';
// External imports
import { useEffect, useState } from 'react';
// Imports
import { cn } from '@lib/utils';
// Types
type IStatusStyles = Record<string, { dark: string; light: string }>;
// Constants
const statusStyle: IStatusStyles = {
  active: {
    dark: 'bg-emerald-200',
    light: 'bg-emerald-400',
  },
  inactive: {
    dark: 'bg-rose-200',
    light: 'bg-rose-400',
  },
  waiting: {
    dark: 'bg-amber-200',
    light: 'bg-amber-400',
  },
  not_status: {
    dark: 'bg-slate-200',
    light: 'bg-slate-400',
  },
};
// React component
export function StatusSelect() {
  const [status, setStatus] = useState<string>('not_status');
  const [styles, setStyles] = useState<{ dark: string; light: string }>(statusStyle.not_status);

  const statusOptions: { value: string; label: string }[] = [
    { value: 'active', label: 'Asistió' },
    { value: 'inactive', label: 'Faltó' },
    { value: 'waiting', label: 'Esperando' },
    { value: 'not_status', label: 'No definido' },
  ];

  useEffect(() => {
    const findStyle = Object.entries(statusStyle).find(([key, value]) => {
      if (key === status) return value;
    })![1];

    setStyles(findStyle);
  }, [status]);

  return (
    <Select defaultValue='not_status' onValueChange={setStatus}>
      <SelectTrigger className='h-5 w-5 justify-center bg-transparent p-0 [&_svg]:hidden'>
        <div className={cn('flex h-4 w-4 items-center justify-center rounded-full bg-rose-200', styles.dark)}>
          <span className={cn('h-2.5 w-2.5 rounded-full bg-rose-400', styles.light)}></span>
        </div>
      </SelectTrigger>
      <SelectContent align='center' className=''>
        <SelectGroup>
          {statusOptions.map((option) => (
            <SelectItem value={option.value} className='[&_svg]:h-3 [&_svg]:w-3'>
              <div className='flex flex-row items-center space-x-2'>
                <div className={cn('flex h-4 w-4 items-center justify-center rounded-full bg-rose-200', statusStyle[option.value].dark)}>
                  <div className={cn('h-2.5 w-2.5 rounded-full bg-rose-400', statusStyle[option.value].light)}></div>
                </div>
                <div className='text-xs'>{option.label}</div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
