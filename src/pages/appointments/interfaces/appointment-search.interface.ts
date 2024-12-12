export enum EAppointmentSearch {
  NAME = 'name',
  DAY = 'day',
}

export interface IAppointmentSearch {
  type: EAppointmentSearch;
  value: Date | string | undefined;
}
