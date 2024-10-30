// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IUser } from '@users/interfaces/user.interface';

export interface IAppointmentForm {
  day: string;
  hour: string;
  professional: string;
  slot: number;
  user: string;
}

export interface IAppointment extends IAppointmentForm {
  _id: string;
}

export interface IAppointmentView {
  _id: string;
  day: string;
  hour: string;
  professional: IProfessional;
  slot: number;
  user: IUser;
}

export interface ITimeRange {
  begin: Date;
  end: Date;
}

export interface ITimeRangeString {
  begin: string;
  end: string;
}

export interface ITimeSlot {
  appointment?: IAppointmentView;
  available: boolean;
  begin: string;
  end: string;
  id: number;
}
