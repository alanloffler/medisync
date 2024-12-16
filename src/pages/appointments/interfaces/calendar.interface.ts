export interface ICalendarFooter {
  calendarMonths: string[];
  calendarYears: string[];
  disabled: boolean;
  selectedMonth: number;
  selectedYear: number;
  selectMonth: (value: string) => void;
  selectYear: (value: string) => void;
}
