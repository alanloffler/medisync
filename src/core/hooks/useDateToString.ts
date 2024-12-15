import { UtilsString } from '@core/services/utils/string.service';
import { useCallback } from 'react';

export function useDateToString(): (date: Date) => string {
  return useCallback((date: Date) => {
    if (date === undefined) return 'Invalid date';

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    let _m, _d: string;

    month < 10 ? (_m = `0${month}`) : (_m = String(month));
    day < 10 ? (_d = `0${day}`) : (_d = String(day));

    return `${year}-${_m}-${_d}`;
  }, []);
}

export function useLegibleDate(): (date: Date, type: 'long' | 'short') => string {
  return useCallback((date: Date, type: 'long' | 'short') => {
    if (date === undefined) return 'Invalid date';
    if (type === undefined) return 'Invalid type';

    const _day: number = date.getDate();
    const _month: number = date.getMonth();
    const _year: number = date.getFullYear();
    const newDate: Date = new Date(_year, _month, _day);

    const weekDay: string = UtilsString.upperCase(newDate.toLocaleString('es', { weekday: 'long' }));
    const day: string = newDate.toLocaleString('es', { day: 'numeric' });
    const month: string = UtilsString.upperCase(date.toLocaleString('es', { month: 'long' }));
    const year: string = date.toLocaleString('es', { year: 'numeric' });

    if (type === 'long') return `${weekDay}, ${day} de ${month} de ${year}`;
    if (type === 'short') return `${day} de ${month} de ${year}`;

    return '';
  }, []);
}
