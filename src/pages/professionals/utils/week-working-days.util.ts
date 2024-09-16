import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';

export function generateWeekOfWorkingDays() {
  const daysOfWeek: IWorkingDay[] = Array.from({ length: 7 }, (_, index) => ({ day: index, value: false }));
  
  return daysOfWeek;
}
