export interface IResponse {
  data: any;
  message: string;
  pagination?: {
    hasMore: boolean;
    totalPages: number;
  };
  statusCode: number;
}
