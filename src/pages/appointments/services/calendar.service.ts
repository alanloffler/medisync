import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';
import { isAfter, range } from '@formkit/tempo';

export class CalendarService {
  private static days: number[] = Array.from({ length: 7 }, (_, index) => index);
  // Used in Appointments -> OK
  public static checkTodayIsWorkingDay(workingDays: IWorkingDay[], dayOfWeekSelected: number): boolean {
    return workingDays.some((day) => day.day === dayOfWeekSelected && day.value === true);
  }
  // Used in Appointments -> OK
  public static getDisabledDays(professionalWorkingDays: IWorkingDay[]): number[] {
    if (!professionalWorkingDays) return [];
    const professionalWorkingDaysNumbers = professionalWorkingDays.filter((day) => day.value === true).map((day) => day.day);
    const professionalNotWorkingDaysNumbers = CalendarService.days.filter((day) => !professionalWorkingDaysNumbers.includes(day));

    return professionalNotWorkingDaysNumbers;
  }
  // Used in Appointments -> OK, return 'Lunes y Miércoles'
  public static getLegibleWorkingDays(daysArray: IWorkingDay[], capitalized: boolean): string {
    const stringDays: string[] = this.getStringWorkingDaysArray(daysArray, capitalized);
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
  // Used in getLegibleWorkingDays -> OK
  private static getStringWorkingDaysArray(days: IWorkingDay[], capitalized: boolean): string[] {
    if (!days) return [];

    // TODO: get language from database
    let daysOfWeek: string[] = range('dddd', 'es');

    if (capitalized) daysOfWeek = daysOfWeek.map((day) => day.charAt(0).toUpperCase() + day.slice(1));
    
    return days
      .filter((day) => day.value)
      .map((day) => daysOfWeek[day.day])
      .filter((day) => typeof day === 'string');
  }
  // Used in Appointments -> OK
  public static getLegibleSchedule(
    slotTimeInit: string,
    slotTimeEnd: string,
    slotUnavailableTimeInit?: string,
    slotUnavailableTimeEnd?: string,
  ): string {
    if (slotUnavailableTimeInit && slotUnavailableTimeEnd) {
      return `${slotTimeInit} ${PV_CONFIG.words.hoursSeparator} ${slotUnavailableTimeInit} ${PV_CONFIG.words.slotsSeparator} ${slotUnavailableTimeEnd} ${PV_CONFIG.words.hoursSeparator} ${slotTimeEnd}`;
    } else {
      return `${slotTimeInit} ${PV_CONFIG.words.hoursSeparator} ${slotTimeEnd}`;
    }
  }

  // TODO: This must be relocalized to the appo schedule class
  public static displayReserveButton(time: string, date: Date | undefined): boolean {
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

  // WIP: function that will replace displayReserveButtons
  // This function is working, make some tests of usavility before replace displayReserveButtons
  // IDEA: maybe this can have a time of delay, like 5 minutes before datetime is not in future
  public static isDatetimeInFuture(date: Date | undefined, time: string): boolean {
    if (!date) return false;
    
    const today: Date = new Date();
    const selectedDay: Date = new Date(date);
    selectedDay.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);

    return isAfter(selectedDay, today);
  }
}
