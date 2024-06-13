/* eslint-disable @typescript-eslint/no-explicit-any */
import { IArea } from "@/core/interfaces/area.interface";
import { ISpecialization } from "@/core/interfaces/specialization.interface";

export interface IProfessionalForm {
  area: string;
  available: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: number | string;
  specialization: string;
  titleAbbreviation: string;
}

export interface IProfessional {
  _id: string;
  area: IArea;
  available: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: number;
  specialization: ISpecialization;
  titleAbbreviation: string;
}
