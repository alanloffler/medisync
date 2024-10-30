export enum EUserSearch {
  NAME = 'name',
  DNI = 'dni',
}

export interface IUserSearch {
  value: string;
  type: EUserSearch;
}
