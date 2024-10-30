import type { IArea } from '@core/interfaces/area.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import type { ITitle } from '@core/interfaces/title.interface';
import type { IWorkingDay } from '@professionals/interfaces/working-days.interface';

export interface IProfessionalForm {
  area: string;
  available: boolean;
  configuration: IProfessionalConfiguration;
  description: string;
  dni: number | string;
  email: string;
  firstName: string;
  lastName: string;
  phone: number | string;
  specialization: string;
  title: string;
}

export interface IProfessional {
  _id: string;
  area: IArea;
  available: boolean;
  configuration: IProfessionalConfiguration;
  description: string;
  dni: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: number;
  specialization: ISpecialization;
  title: ITitle;
}

interface IProfessionalConfiguration {
  scheduleTimeEnd: string;
  scheduleTimeInit: string;
  slotDuration: number | string;
  unavailableTimeSlot?: {
    timeSlotUnavailableInit?: string;
    timeSlotUnavailableEnd?: string;
  };
  workingDays: IWorkingDay[];
}
