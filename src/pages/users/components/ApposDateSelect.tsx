// Icons: https://lucide.dev/icons/
import { CalendarIcon } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
// External imports
import { format, parse } from '@formkit/tempo';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
// Imports
import type { IAppointmentView } from '@/pages/appointments/interfaces/appointment.interface';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// React component
export function ApposDateSelect({ appointments, onValueChange }: { appointments: IAppointmentView[]; onValueChange: (e: string) => void }) {
  const [year, setYear] = useState<string>('');
  const [calendarScope, calendarAnimation] = useAnimate();

  useEffect(() => {
    if (appointments.length > 0) {
      console.log(appointments.length);
    }
  }, [appointments.length]);

  const uniqueYears: string[] = appointments
    .map((appointment: IAppointmentView) => parse(appointment.day).getFullYear().toString())
    .filter((value, index, array) => {
      return array.indexOf(value) === index;
    });

    function clearYear(): void {
      setYear('');
      onValueChange('');
    }
    // TODO: show year on date picker, see the method to clear year and set placeholder
    // Also, must style the inputs
    // FIXME: create a api call which will return the unique years from a db query (now has a bug)

  return (
    <main className='flex flex-row items-center space-x-2'>
      <span className='text-[13px] font-medium text-slate-500'>Fecha</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className='h-8 w-[180px] justify-start space-x-3 border bg-white px-3 text-left text-[13px] font-normal text-foreground shadow-sm hover:bg-white'
            variant='ghost'
            onMouseOver={() => calendarAnimation(calendarScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
            onMouseOut={() => calendarAnimation(calendarScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
          >
            <CalendarIcon ref={calendarScope} size={16} strokeWidth={2} />
            {year !== '' ? <span>{format(year, 'dd/MM/yyyy')}</span> : <span>Seleccionar</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <section className='flex w-[180px] flex-col space-y-2 p-3'>
            <section className='flex flex-row items-center space-x-2'>
              <span className='text-[13px] font-medium text-slate-500'>Año</span>
              <Select onValueChange={onValueChange}>
                <SelectTrigger className={'h-8 w-full space-x-2 border bg-white text-[13px] shadow-sm'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {uniqueYears.map((year) => (
                      <SelectItem key={crypto.randomUUID()} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={clearYear}>X</Button>
            </section>
          </section>
        </PopoverContent>
      </Popover>
    </main>
  );
}
