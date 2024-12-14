// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@core/components/ui/select';
// External imports
import { useEffect, useState } from 'react';
// Imports
import { cn } from '@lib/utils';
import { AppoSchedule } from '@appointments/services/schedule.service';
import { EStatus } from '@appointments/enums/status.enum';
// Interfaces
interface IStatusSelect {
  day: string;
  hour: string;
  mode: 'update' | 'view';
  status: string;
}

interface IStatusOption {
  label: string;
  style: { dark: string; light: string };
  value: string;
}
// React component
export function StatusSelect({ day, hour, mode, status }: IStatusSelect) {
  const [itemSelected, setItemSelected] = useState<string>(status);
  const statusOptions: IStatusOption[] = [
    {
      value: EStatus.ATTENDED,
      label: 'Asistió',
      style: {
        dark: 'bg-emerald-200',
        light: 'bg-emerald-400',
      },
    },
    {
      value: EStatus.NOT_ATTENDED,
      label: 'No asistió',
      style: {
        dark: 'bg-rose-200',
        light: 'bg-rose-400',
      },
    },
    {
      value: EStatus.NOT_STATUS,
      label: 'Sin estado',
      style: {
        dark: 'bg-slate-200',
        light: 'bg-slate-400',
      },
    },
    {
      value: EStatus.WAITING,
      label: 'Aguardando',
      style: {
        dark: 'bg-amber-200',
        light: 'bg-amber-400',
      },
    },
  ];

  useEffect(() => {
    const futureDate = AppoSchedule.isDatetimeInFuture(new Date(day), hour);
    futureDate ? setItemSelected(EStatus.WAITING) : setItemSelected(status);
  }, [day, hour, status]);

  function handleStatusChange(status: string) {
    setItemSelected(status);
    if (mode === 'update') {
      console.log('can update');
    }
  }

  return (
    <Select value={itemSelected} onValueChange={(e) => handleStatusChange(e)} disabled={itemSelected === EStatus.WAITING || mode === 'view'}>
      <SelectTrigger className='h-5 w-5 justify-center bg-transparent p-0 [&_svg]:hidden'>
        <div
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-full bg-rose-200',
            statusOptions.find((item) => item.value === itemSelected)?.style.dark,
          )}
        >
          <span className={cn('h-2.5 w-2.5 rounded-full bg-rose-400', statusOptions.find((item) => item.value === itemSelected)?.style.light)}></span>
        </div>
      </SelectTrigger>
      <SelectContent align='center'>
        <SelectGroup>
          {statusOptions.map((option) => (
            <SelectItem key={crypto.randomUUID()} value={option.value} className='[&_svg]:h-3 [&_svg]:w-3'>
              <div className='flex flex-row items-center space-x-2'>
                <div className={cn('flex h-4 w-4 items-center justify-center rounded-full', option.style.dark)}>
                  <div className={cn('h-2.5 w-2.5 rounded-full', option.style.light)}></div>
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
