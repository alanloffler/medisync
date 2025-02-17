// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import type { ICalendarFooter } from '@appointments/interfaces/calendar.interface';
import { UtilsString } from '@core/services/utils/string.service';
// React component
export function CalendarFooter({ calendarMonths, calendarYears, disabled, selectedMonth, selectedYear, selectMonth, selectYear }: ICalendarFooter) {
  const { t } = useTranslation();

  return (
    <main className='flex space-x-3 text-xs'>
      <Select value={selectedYear.toString()} onValueChange={selectYear} disabled={disabled}>
        <SelectTrigger className='h-7 w-fit bg-input px-2 text-xs hover:bg-input-hover disabled:opacity-50 disabled:hover:bg-input [&_svg]:ml-2'>
          <SelectValue placeholder={t('placeholder.year')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {calendarYears.map((year) => (
              <SelectItem className='py-1 text-xs [&_svg]:h-3 [&_svg]:w-3' key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={selectedMonth.toString()} onValueChange={selectMonth} disabled={disabled}>
        <SelectTrigger className='h-7 w-fit bg-input px-2 text-xs hover:bg-input-hover disabled:opacity-50 disabled:hover:bg-input [&_svg]:ml-2'>
          <SelectValue placeholder={t('placeholder.month')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {calendarMonths.map((month, index) => (
              <SelectItem className='py-1 text-xs [&_svg]:h-3 [&_svg]:w-3' key={month} value={index.toString()}>
                {UtilsString.upperCase(month)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}
