// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import type { ICalendarFooter } from '@appointments/interfaces/calendar.interface';
import { UtilsString } from '@core/services/utils/string.service';
// React component
export function CalendarFooter({ calendarMonths, calendarYears, selectedMonth, selectedYear, selectMonth, selectYear }: ICalendarFooter) {
  const { t } = useTranslation();

  return (
    <main className='flex w-full space-x-3 pt-3 text-xs'>
      <Select value={selectedYear.toString()} onValueChange={selectYear}>
        <SelectTrigger className='h-7 w-1/2 border text-xs'>
          <SelectValue placeholder={t('placeholder.year')} />
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
          <SelectValue placeholder={t('placeholder.month')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {calendarMonths.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {UtilsString.upperCase(month)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
