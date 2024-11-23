export interface IResponse {
  data: any;
  message: string;
  pagination?: {
    hasMore: boolean;
    totalItems: number;
  };
  statusCode: number;
}
