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
import { APP_CONFIG } from '@/config/app.config';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useSearchParams } from 'react-router-dom';
// React component
export function ApposDateSelect({
  userId,
  onValueChange,
}: {
  userId: string;
  onValueChange: (year: string | undefined, month: string | undefined) => void;
}) {
  const [months, setMonths] = useState<string[]>([]);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const [calendarScope, calendarAnimation] = useAnimate();
  const [clearYearScope, clearYearAnimation] = useAnimate();
  const capitalize = useCapitalize();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();

  function setSelectedDate(year: string | undefined, month: string | undefined): void {
    console.log('year', year, 'month', month);
    if (year !== undefined) {
      month !== undefined ? onValueChange(year, month) : onValueChange(year, undefined);
      setOpenPopover(false);
    } else handleClearDateFilter();
  }

  // WORKING: reset year and month selected and reload the appos
  function handleClearDateFilter(): void {
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
    onValueChange(undefined, undefined);
    setOpenPopover(false);
    setSearchParams({});
  }

  // WORKING: load years by user appos
  useEffect(() => {
    // TODO: handle errors and loading
    AppointmentApiService.findApposYearsByUser(userId).then((response: IResponse) => {
      setYears(response.data);
    });
  }, [userId]);

  // WORKING: but check if some params are unnecessary
  useEffect(() => {
    setSelectedMonth(undefined);
    // TODO: handle errors and loading
    if (selectedYear !== undefined) {
      AppointmentApiService.findApposMonthsByUser(userId, selectedYear).then((response: IResponse) => {
        setMonths(response.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

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
      <span className='text-[13px] font-medium text-slate-500'>{USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.label}</span>
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
              <span>{USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <section className='flex w-[200px] flex-col space-y-2 p-3'>
            <section className='flex flex-col space-y-3'>
              <div className='flex flex-row place-content-start items-center space-x-2'>
                <span className='text-[13px] font-medium text-slate-500'>
                  {USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.yearSelect.label}
                </span>
                <Select value={selectedYear} onValueChange={(e) => setSelectedYear(e)}>
                  <SelectTrigger className={'h-6 w-fit space-x-2 border bg-white text-xs shadow-sm'}>
                    <SelectValue placeholder={USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.yearSelect.placeholder} />
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
                <span className='text-[13px] font-medium text-slate-500'>
                  {USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.monthSelect.label}
                </span>
                <Select value={selectedMonth} onValueChange={(e) => setSelectedMonth(e)} disabled={selectedYear === undefined}>
                  <SelectTrigger className={'h-6 w-fit space-x-2 border bg-white text-xs shadow-sm disabled:opacity-50'}>
                    <SelectValue placeholder={USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.monthSelect.placeholder} />
                  </SelectTrigger>
                  <SelectContent className='w-fit min-w-10' onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectGroup>
                      {months.map((month) => (
                        <SelectItem key={crypto.randomUUID()} value={month} className='py-1 text-xs [&>span>span>svg]:h-3 [&>span>span>svg]:w-3'>
                          {capitalize(format(new Date(month), 'MMMM', APP_CONFIG.i18n.locale))}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button disabled={selectedYear === undefined} variant='default' size='xs' onClick={() => setSelectedDate(selectedYear, selectedMonth)}>
                {USER_VIEW_CONFIG.appointmentsRecord.select.datePicker.button.search}
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
          onClick={handleClearDateFilter}
          onMouseOver={bounceClearYearOver}
          onMouseOut={bounceClearYearOut}
        >
          <X size={14} strokeWidth={1.5} />
        </Button>
      )}
    </main>
  );
}
