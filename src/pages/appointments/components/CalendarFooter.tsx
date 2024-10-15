// External components
// https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// Imports
import type { ICalendarFooter } from '@/pages/appointments/interfaces/calendar.interface';
import { APPO_CONFIG } from '@/config/appointment.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export default function CalendarFooter({ calendarMonths, calendarYears, selectedMonth, selectedYear, selectMonth, selectYear }: ICalendarFooter) {
  const capitalize = useCapitalize();

  return (
    <main className='flex w-full space-x-3 pt-3 text-xs'>
      <Select value={selectedYear.toString()} onValueChange={selectYear}>
        <SelectTrigger className='h-7 w-1/2 border text-xs'>
          <SelectValue placeholder={APPO_CONFIG.calendar.placeholder.year} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {calendarYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={selectedMonth.toString()} onValueChange={selectMonth}>
        <SelectTrigger className='h-7 w-1/2 border text-xs'>
          <SelectValue placeholder={APPO_CONFIG.calendar.placeholder.month} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {calendarMonths.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {capitalize(month)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
