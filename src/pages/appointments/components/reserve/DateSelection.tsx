// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Calendar } from '@core/components/ui/calendar';
// Components
import { CalendarFooter } from '@appointments/components/CalendarFooter';
// External imports
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { es, enUS, Locale } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import { CalendarService } from '@appointments/services/calendar.service';
import { RESERVE_APPOINTMENT_CONFIG as RA_CONFIG } from '@config/appointments/reserve-appointments.config';
import { cn } from '@lib/utils';
// Interface
interface IProps {
  date?: Date;
  disabledDays: number[];
  professional?: IProfessional;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}
// React component
export function DateSelection({ date, disabledDays, professional, setSelectedDate }: IProps) {
  const [calendarKey, setCalendarKey] = useState<string>('');
  const [calendarLocale, setCalendarLocale] = useState<Locale>();
  const [calendarMonths, setCalendarMonths] = useState<string[]>([]);
  const [calendarYears, setCalendarYears] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { i18n, t } = useTranslation();

  const selectedLocale: string = i18n.resolvedLanguage || i18n.language;

  useEffect(() => {
    const calendarYears: string[] = CalendarService.generateYearsRange(RA_CONFIG.calendar.yearsRange);
    setCalendarYears(calendarYears);

    const calendarMonths: string[] = CalendarService.generateMonths(selectedLocale);
    setCalendarMonths(calendarMonths);

    if (selectedLocale === 'es') setCalendarLocale(es);
    if (selectedLocale === 'en') setCalendarLocale(enUS);
  }, [selectedLocale]);

  useEffect(() => {
    console.log('Professional changed');
  }, [professional]);

  function selectYear(value: string): void {
    setSelectedYear(parseInt(value));
    setCalendarKey(crypto.randomUUID());
  }

  function selectMonth(value: string): void {
    setSelectedMonth(parseInt(value));
    setCalendarKey(crypto.randomUUID());
  }

  const daysWithAppos = [
    { day: '2024-12-02', value: 5 },
    { day: '2024-12-12', value: 25 },
  ];

  return (
    <section className={cn('flex flex-col space-y-3')}>
      <h5 className='flex items-center gap-2 text-xsm font-semibold uppercase'>
        <span className='flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-center leading-none text-background'>2</span>
        {t('section.appointments.reserve.steps.title2')}
      </h5>
      <Calendar
        className='mx-auto text-card-foreground'
        defaultMonth={new Date(selectedYear, selectedMonth)}
        disabled={[
          new Date(2024, 11, 24),
          new Date(2024, 11, 25),
          { dayOfWeek: disabledDays },
          // { before: new Date() }, // This is to disable past days
          // { from: new Date(2024, 11, 24) },
        ]}
        fromYear={Number(calendarYears[0])}
        key={calendarKey}
        locale={calendarLocale}
        mode='single'
        onDayClick={(event) => professional && setSelectedDate(event)}
        onMonthChange={(month) => {
          setSelectedMonth(month.getMonth());
          setSelectedYear(month.getFullYear());
        }}
        selected={date}
        showOutsideDays={false}
        toYear={Number(calendarYears[calendarYears.length - 1])}
        formatters={{
          formatDay: (day) => {
            const numberDay: number = day.getDate();
            const found = daysWithAppos.find((item) => {
              const transformed = parseInt(item.day.split('-')[2]);
              if (transformed === numberDay) return item;
            });
            return found ? (
              <div>
                <span className='font-semibold'>{numberDay}</span>
                <span className='absolute bottom-1.5 right-1.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-emerald-400 text-[9px] leading-none text-white'></span>
                {/* <span className='absolute bottom-1.5 right-0 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-emerald-400'></span> */}
              </div>
            ) : (
              <>{numberDay}</>
            );
          },
        }}
      />
      <section className='flex w-full flex-row items-center justify-center space-x-3'>
        <Button
          variant='default'
          className='h-7 w-fit px-2 text-xs'
          onClick={() => {
            setSelectedMonth(new Date().getMonth());
            setSelectedYear(new Date().getFullYear());
            setSelectedDate(new Date());
            setCalendarKey(crypto.randomUUID());
          }}
        >
          {t('button.today')}
        </Button>
        <CalendarFooter
          calendarMonths={calendarMonths}
          calendarYears={calendarYears}
          disabled={!professional}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectMonth={selectMonth}
          selectYear={selectYear}
        />
      </section>
    </section>
  );
}
