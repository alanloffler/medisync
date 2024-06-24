export interface IUserForm {
  dni: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface IUser extends IUserForm {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
