import { IArea } from '@/core/interfaces/area.interface';
import { ISpecialization } from '@/core/interfaces/specialization.interface';
import { ITitle } from '@/core/interfaces/title.interface';
import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';

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
  unavailableObject: TMP;
}

interface TMP {
  timeSlotUnavailableInit?: string;
  timeSlotUnavailableEnd?: string;
}

interface IProfessionalConfiguration {
  scheduleTimeEnd: string;
  scheduleTimeInit: string;
  slotDuration: number;
  // timeSlotUnavailableEnd?: string;
  // timeSlotUnavailableInit?: string;
  workingDays: IWorkingDay[];
}
