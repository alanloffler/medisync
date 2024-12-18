export interface IUserForm {
  dni: number;
  email?: string;
  firstName: string;
  lastName: string;
  phone: number;
}

export interface IUser extends IUserForm {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
