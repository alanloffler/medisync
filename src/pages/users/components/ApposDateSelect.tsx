// Icons: https://lucide.dev/icons/
import { CalendarIcon, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// External imports
import { format } from '@formkit/tempo';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
// Imports
import type { IResponse } from '@/core/interfaces/response.interface';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function ApposDateSelect({ userId, onValueChange }: { userId: string; onValueChange: (year: string | undefined, month: string | undefined) => void }) {
  const [months, setMonths] = useState<string[]>([]);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [years, setYears] = useState<string[]>([]);
  const [calendarScope, calendarAnimation] = useAnimate();
  const [clearYearScope, clearYearAnimation] = useAnimate();
  const capitalize = useCapitalize();

  useEffect(() => {
    // TODO: handle errors and loading
    AppointmentApiService.findApposYearsByUser(userId).then((response: IResponse) => {
      setYears(response.data);
    });
  }, [userId]);

  function handleYearChange(year: string | undefined, month: string | undefined): void {
    if (year !== undefined) {
      (month !== undefined) ? onValueChange(year, month) : onValueChange(year, undefined);
      setOpenPopover(false);
    } else {
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
      onValueChange(undefined, undefined);
      setOpenPopover(false);
    }
  }

  useEffect(() => {
    // TODO: handle errors and loading
    if (selectedYear !== undefined) {
      AppointmentApiService.findApposMonthsByUser(userId, selectedYear).then((response: IResponse) => {
        setMonths(response.data);
      });
    }
  }, [selectedYear, userId]);

  function bounceClearYearOver(): void {
    clearYearAnimation(clearYearScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  function bounceClearYearOut(): void {
    clearYearAnimation(clearYearScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  function bounceCalendarOver(): void {
    calendarAnimation(calendarScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  function bounceCalendarOut(): void {
    calendarAnimation(calendarScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  return (
    <main className='flex flex-row items-center space-x-2'>
      <span className='text-[13px] font-medium text-slate-500'>Fecha</span>
      <Popover open={openPopover} onOpenChange={(e) => setOpenPopover(e)}>
        <PopoverTrigger asChild>
          <Button
            className='h-8 w-fit justify-start space-x-3 border bg-white px-3 text-left text-[13px] font-normal text-foreground shadow-sm hover:bg-white'
            variant='ghost'
            onMouseOver={bounceCalendarOver}
            onMouseOut={bounceCalendarOut}
          >
            <CalendarIcon ref={calendarScope} size={16} strokeWidth={2} />
            {selectedYear !== undefined ? (
              selectedMonth !== undefined ? (
                <span>{`${selectedMonth} / ${selectedYear}`}</span>
              ) : (
                <span>{selectedYear}</span>
              )
            ) : (
              <span>Seleccionar</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <section className='flex w-[180px] flex-col space-y-2 p-3'>
            <section className='flex flex-col space-y-3'>
              <div className='flex flex-row place-content-start items-center space-x-2'>
                <span className='text-[13px] font-medium text-slate-500'>Año</span>
                <Select value={selectedYear} onValueChange={(e) => setSelectedYear(e)}>
                  <SelectTrigger className={'h-6 w-fit space-x-2 border bg-white text-xs shadow-sm'}>
                    <SelectValue placeholder='Año' />
                  </SelectTrigger>
                  <SelectContent className='w-fit min-w-10' onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectGroup>
                      {years.map((year) => (
                        <SelectItem key={crypto.randomUUID()} value={year} className='py-1 text-xs [&>span>span>svg]:h-3 [&>span>span>svg]:w-3'>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-row place-content-start items-center space-x-2'>
                <span className='text-[13px] font-medium text-slate-500'>Mes</span>
                <Select value={selectedMonth} onValueChange={(e) => setSelectedMonth(e)} disabled={selectedYear === undefined}>
                  <SelectTrigger className={'h-6 w-fit space-x-2 border bg-white text-xs shadow-sm disabled:opacity-50'}>
                    <SelectValue placeholder='Mes' />
                  </SelectTrigger>
                  <SelectContent className='w-fit min-w-10' onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectGroup>
                      {months.map((month) => (
                        <SelectItem key={crypto.randomUUID()} value={month} className='py-1 text-xs [&>span>span>svg]:h-3 [&>span>span>svg]:w-3'>
                          {capitalize(format(new Date(month), 'MMMM', 'es'))}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button variant='default' size='xs' onClick={() => handleYearChange(selectedYear, selectedMonth)}>
                Buscar
              </Button>
            </section>
          </section>
        </PopoverContent>
      </Popover>
      {selectedYear !== undefined && (
        <Button
          className='h-5 w-5 rounded-full bg-black p-0 text-xs font-medium text-white hover:bg-black/70'
          ref={clearYearScope}
          size='miniIcon'
          variant='default'
          onClick={() => handleYearChange(undefined, undefined)}
          onMouseOver={bounceClearYearOver}
          onMouseOut={bounceClearYearOut}
        >
          <X size={14} strokeWidth={1.5} />
        </Button>
      )}
    </main>
  );
}
