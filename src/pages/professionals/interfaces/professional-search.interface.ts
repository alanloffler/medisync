export enum EProfessionalSearch {
  INPUT = 'professional',
  DROPDOWN = 'specialization',
}

export interface IProfessionalSearch {
  value: string;
  type: EProfessionalSearch;
}
