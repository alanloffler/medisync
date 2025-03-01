export interface IResponse<T = any> {
  data: T;
  message: string;
  pagination?: {
    hasMore: boolean;
    totalItems: number;
  };
  stats?: IStats;
  statusCode: number;
}

export interface IStats {
  attended: number;
  notAttended: number;
  notStatus: number;
  total: number;
}
