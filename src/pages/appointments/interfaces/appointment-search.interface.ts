export enum EAppointmentSearch {
  NAME = 'name',
  DAY = 'day',
}

export interface IAppointmentSearch {
  value: string;
  type: EAppointmentSearch;
}
