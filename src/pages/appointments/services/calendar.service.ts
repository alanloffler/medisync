import { APP_CONFIG } from '@/config/app.config';
import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';

export class CalendarService {
  private static days: number[] = [0, 1, 2, 3, 4, 5, 6];

  public static getDisabledDays(professionalWorkingDays: IWorkingDay[]): number[] {
    if (!professionalWorkingDays) return [];

    const professionalWorkingDaysNumbers = professionalWorkingDays.filter((day) => day.value === true).map((day) => day.day + 1);
    const professionalNotWorkingDaysNumbers = CalendarService.days.filter((day) => !professionalWorkingDaysNumbers.includes(day));

    return professionalNotWorkingDaysNumbers;
  }

  public static getLegibleWorkingDays(daysArray: IWorkingDay[]): string {
    const stringDays = this.getStringWorkingDays(daysArray);
    if (!stringDays) return '';

    const legibleDays: string = stringDays
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

    return legibleDays;
  }

  private static getStringWorkingDays(days: IWorkingDay[]): string[] {
    if (!days) return [];

    const daysOfWeek: string[] = APP_CONFIG.daysofWeek.long;

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

    return daysArray as string[];
  }

  public static getLegibleSchedule(
    slotTimeInit: string,
    slotTimeEnd: string,
    slotUnavailableTimeInit: string | undefined,
    slotUnavailableTimeEnd: string | undefined,
  ): string {
    if (slotUnavailableTimeInit && slotUnavailableTimeEnd) {
      return `${slotTimeInit} ${PV_CONFIG.words.hoursSeparator} ${slotUnavailableTimeInit} ${PV_CONFIG.words.slotsSeparator} ${slotUnavailableTimeEnd} ${PV_CONFIG.words.hoursSeparator} ${slotTimeEnd}`;
    } else {
      return `${slotTimeInit} ${PV_CONFIG.words.hoursSeparator} ${slotTimeEnd}`;
    }
  }

  public static displayReserveButton(time: string, date: Date | undefined): boolean {
    // console.log(time, date);
    let today: string;
    let selectedDay: string;

    if (date) {
      today = new Date().toISOString().split('T')[0];
      selectedDay = new Date(date).toISOString().split('T')[0];

      if (today === selectedDay) {
        const hour: number = parseInt(time.split(':')[0]);
        const actualHour: number = new Date().getHours();

        if (hour < actualHour) return false;
        if (hour === actualHour && new Date().getMinutes() > parseInt(time.split(':')[1])) return false;
        return true;
      } else if (selectedDay < today) return false;
      return true;
    } else return false;
  }
}
