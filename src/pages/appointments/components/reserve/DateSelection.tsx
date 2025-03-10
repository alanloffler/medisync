// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Calendar } from '@core/components/ui/calendar';
// Components
import { CalendarFooter } from '@appointments/components/CalendarFooter';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { es, enUS, Locale } from 'date-fns/locale';
import { parse } from '@formkit/tempo';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { CalendarService } from '@appointments/services/calendar.service';
import { RESERVE_APPOINTMENT_CONFIG as RA_CONFIG } from '@config/appointments/reserve-appointments.config';
import { cn } from '@lib/utils';
import { useReserveFilters } from '@appointments/hooks/useReserveFilters';
// Interface
interface IProps {
  disabledDays: number[];
  professional?: IProfessional;
  handleDaysWithAppos: { day: string; action: string; id: string } | undefined;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}
// React component
export function DateSelection({ disabledDays, professional, handleDaysWithAppos, selectedDate, setSelectedDate }: IProps) {
  const [calendarKey, setCalendarKey] = useState<string>('');
  const [calendarLocale, setCalendarLocale] = useState<Locale>();
  const [calendarMonths, setCalendarMonths] = useState<string[]>([]);
  const [calendarYears, setCalendarYears] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { dateParam, professionalParam } = useReserveFilters();
  const { i18n, t } = useTranslation();
  const selectedLocale: string = i18n.resolvedLanguage || i18n.language;

  // Fetch days with appointments
  const {
    data: daysWithAppos,
    isPending,
    mutate: fetchDaysWithAppos,
  } = useMutation<IResponse<{ day: string }[]> | undefined>({
    mutationKey: ['appointments', 'daysWithAppos', professional?._id, selectedYear, selectedMonth],
    mutationFn: async () => {
      if (professional) {
        return await AppointmentApiService.daysWithAppos(professional._id, selectedYear, selectedMonth + 1);
      }
      return { statusCode: 200, message: 'Default empty days with appos', data: [] };
    },
  });

  // Calendar year and month actions when selected
  const selectYear = useCallback((value: string): void => {
    setSelectedYear(parseInt(value));
    setCalendarKey(crypto.randomUUID());
  }, []);

  const selectMonth = useCallback((value: string): void => {
    setSelectedMonth(parseInt(value));
    setCalendarKey(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (professionalParam !== null) {
      fetchDaysWithAppos();

      const calendarYears: string[] = CalendarService.generateYearsRange(RA_CONFIG.calendar.yearsRange);
      setCalendarYears(calendarYears);

      const calendarMonths: string[] = CalendarService.generateMonths(selectedLocale);
      setCalendarMonths(calendarMonths);

      if (selectedLocale === 'es') setCalendarLocale(es);
      if (selectedLocale === 'en') setCalendarLocale(enUS);

      if (dateParam !== null && dateParam !== undefined) {
        const dateParamTransformed: Date = parse(dateParam, 'YYYY-MM-DD');

        setSelectedDate(dateParamTransformed);
        setCalendarKey(crypto.randomUUID());
      }
    } else {
      setSelectedDate(undefined);
    }
  }, [dateParam, fetchDaysWithAppos, professionalParam, selectedLocale, setSelectedDate]);

  // Handle days with appointments when action from schedule is create or delete
  useEffect(() => {
    if (handleDaysWithAppos) {
      const { action, day } = handleDaysWithAppos;

      if (action === 'create') {
        const exists: boolean | undefined = daysWithAppos?.data?.some((item) => item.day === day);
        if (!exists) daysWithAppos?.data?.push({ day: day });
      }

      if (action === 'delete') {
        const index: number | undefined = daysWithAppos?.data?.findIndex((item) => item.day === day);
        if (index && index !== -1) daysWithAppos?.data?.splice(index, 1);
      }
    }
  }, [daysWithAppos?.data, handleDaysWithAppos]);

  // Fetch days with appointments on month or year change
  useEffect(() => {
    if (professional) {
      fetchDaysWithAppos();
    }
  }, [fetchDaysWithAppos, professional, selectedMonth, selectedYear]);

  return (
    <section className={cn('flex flex-col space-y-3')}>
      <h5 className='flex items-center gap-2 text-xsm font-semibold uppercase'>
        <span className='flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-center leading-none text-background'>2</span>
        {t('section.appointments.reserve.steps.title2')}
      </h5>
      <Calendar
        className={cn('mx-auto text-card-foreground', !professional && 'pointer-events-none opacity-50')}
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
        onDayClick={(event) => {
          if (professional) setSelectedDate(event);
        }}
        onMonthChange={(month) => {
          setSelectedMonth(month.getMonth());
          setSelectedYear(month.getFullYear());
        }}
        selected={selectedDate}
        showOutsideDays={false}
        toYear={Number(calendarYears[calendarYears.length - 1])}
        footer={isPending && <LoadingDB text={t('loading.appointments')} className='mx-0 text-xs [&_svg]:w-3' />}
        formatters={{
          formatDay: (day) => {
            const numberDay: number = day.getDate();
            const found = daysWithAppos?.data?.find((item) => {
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
      <section className='-mt-3 flex w-full flex-row items-center justify-center space-x-3'>
        <Button
          variant='default'
          className='h-7 w-fit px-2 text-xs disabled:pointer-events-auto disabled:cursor-not-allowed'
          disabled={!professional}
          onClick={() => {
            const today = new Date();
            setSelectedYear(today.getFullYear());
            setSelectedMonth(today.getMonth());
            setSelectedDate(today);
            // setCalendarKey(crypto.randomUUID());

            // setSelectedYear(new Date().getFullYear());
            // setSelectedMonth(new Date().getMonth());
            // setSelectedDate(new Date());
            // setCalendarKey(crypto.randomUUID());
          }}
        >
          {t('button.today')}
        </Button>
        <CalendarFooter
          calendarMonths={calendarMonths}
          calendarYears={calendarYears}
          disabled={!professional}
          selectMonth={selectMonth}
          selectYear={selectYear}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </section>
    </section>
  );
}
