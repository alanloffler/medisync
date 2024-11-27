// External imports
import { range } from '@formkit/tempo';
import i18next from 'i18next';
// Imports
import type { IWorkingDay } from '@professionals/interfaces/working-days.interface';

export class CalendarService {
  private static days: number[] = Array.from({ length: 7 }, (_, index) => index);
  // Used on appointments (select calendar day if it's working day)
  public static checkTodayIsWorkingDay(workingDays: IWorkingDay[], dayOfWeekSelected: number): boolean {
    return workingDays.some((workingDay) => workingDay.day === dayOfWeekSelected && workingDay.value === true);
  }
  // Used on appointments calendar component
  public static getDisabledDays(professionalWorkingDays: IWorkingDay[]): number[] {
    if (!professionalWorkingDays) return [];

    const professionalWorkingDaysNumbers: number[] = professionalWorkingDays.filter((day) => day.value === true).map((day) => day.day);
    const professionalNotWorkingDaysNumbers: number[] = CalendarService.days.filter((day) => !professionalWorkingDaysNumbers.includes(day));

    return professionalNotWorkingDaysNumbers;
  }
  // Used on appointments professional selected
  public static getLegibleWorkingDays(daysArray: IWorkingDay[], capitalized: boolean, locale: string): string {
    const stringDays: string[] = this.getStringWorkingDaysArray(daysArray, capitalized, locale);

    if (!stringDays) return '';

    const legibleDays: string = stringDays
      .map((item, index, arr) => {
        if (arr.length === 1) {
          return item;
        } else {
          if (index === arr.length - 1) return `${i18next.t('words.and')} ${item}`;
          if (index === arr.length - 2) return `${item}`;
          return `${item},`;
        }
      })
      .join(' ');

    return legibleDays;
  }
  // Used on private getLegibleWorkingDays for string days conversion
  private static getStringWorkingDaysArray(days: IWorkingDay[], capitalized: boolean, locale: string): string[] {
    if (!days) return [];

    // TODO: get language from database
    let daysOfWeek: string[] = range('dddd', locale);

    if (capitalized) daysOfWeek = daysOfWeek.map((day) => day.charAt(0).toUpperCase() + day.slice(1));

    return days
      .filter((day) => day.value)
      .map((day) => daysOfWeek[day.day])
      .filter((day) => typeof day === 'string');
  }
  // Used on appointments professional selected
  public static getLegibleSchedule(
    slotTimeInit: string,
    slotTimeEnd: string,
    slotUnavailableTimeInit?: string,
    slotUnavailableTimeEnd?: string,
  ): string {
    if (slotUnavailableTimeInit && slotUnavailableTimeEnd) {
      return `${slotTimeInit} ${i18next.t('words.hoursSeparator')} ${slotUnavailableTimeInit} ${i18next.t('words.slotsSeparator')} ${slotUnavailableTimeEnd} ${i18next.t('words.hoursSeparator')} ${slotTimeEnd}`;
    } else {
      return `${slotTimeInit} ${i18next.t('words.hoursSeparator')} ${slotTimeEnd}`;
    }
  }
  // Used on appointments
  public static generateYearsRange(rangeLimit: number): string[] {
    const yearsRange: number[] = [];
    const actualYear: number = new Date().getFullYear();

    yearsRange.push(actualYear);

    if (rangeLimit > 0) for (let i: number = 1; i <= rangeLimit; i++) yearsRange.push(actualYear - i);

    const orderedYearsRange: string[] = yearsRange.sort((a, b) => a - b).map((year) => year.toString());

    return orderedYearsRange;
  }
  // Used on appointments
  public static generateMonths(language: string): string[] {
    return range('MMMM', language);
  }
}
