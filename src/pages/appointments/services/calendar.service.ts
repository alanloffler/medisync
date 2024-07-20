import { APP_CONFIG } from '@/config/app.config';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';
import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';

export class CalendarService {
  private static days: number[] = [0, 1, 2, 3, 4, 5, 6];

  constructor() {}

  public static getDisabledDays(professionalWorkingDays: IWorkingDay[] | undefined): number[] | undefined {
    if (!professionalWorkingDays) return;

    const professionalWorkingDaysNumbers = professionalWorkingDays.filter((day) => day.value === true).map((day) => day.day + 1);

    const professionalNotWorkingDaysNumbers = CalendarService.days.filter((day) => !professionalWorkingDaysNumbers.includes(day));

    return professionalNotWorkingDaysNumbers;
  }
  


  public static getLegibleWorkingDays(daysArray: IWorkingDay[] | undefined) {
      const stringDays = this.getStringWorkingDays(daysArray);
      if (!stringDays) return;
      return stringDays
        .map((item, index, arr) => {
          if (arr.length === 1) {
            return item;
          } else {
            if (index === arr.length - 1) return `${PV_CONFIG.words.and} ${item}`;
            if (index === arr.length - 2) return `${item}`;
            return `${item},`;
          }
        })
        .join(' ');
  }
  private static getStringWorkingDays(days: IWorkingDay[] | undefined) {
    const daysOfWeek: string[] = APP_CONFIG.daysofWeek.long;

    if (!days) return;

    const daysArray = days
      .map((day: IWorkingDay) => {
        if (day.value === true) return day.day;
      })
      .map((value) => {
        if (typeof value === 'number' && value >= 0 && value < daysOfWeek.length) {
          return daysOfWeek[value];
        }
        return value;
      })
      .filter((value) => typeof value === 'string');

      return daysArray;
  }
}
