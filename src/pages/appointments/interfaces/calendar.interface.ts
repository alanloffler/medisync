export interface ICalendarFooter {
  calendarMonths: string[];
  calendarYears: string[];
  selectedMonth: number;
  selectedYear: number;
  selectMonth: (value: string) => void;
  selectYear: (value: string) => void;
}
