export interface IPayload {
  _id: string;
  email: string;
  role: string;
}

export interface IPayloadPlus extends IPayload {
  firstName: string;
  lastName: string;
}
