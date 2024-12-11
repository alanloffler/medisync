export enum EAppointmentSearch {
  NAME = 'name',
  DNI = 'dni',
}

export interface IAppointmentSearch {
  value: string;
  type: EAppointmentSearch;
}
