import { ISpecialization } from './specialization.interface';

export interface IArea {
  _id: string;
  active: number;
  description: string;
  name: string;
  plural: string;
  specializations: ISpecialization[];
}
