import { Pagination } from '../types/pagination';

interface ApiResponseConstructorParams {
  message: string;
  statusCode: number;
  cookies?: Array<{ name: string; value: string }>;
  clearCookie?: string[];
  data?: any;
  fieldName?: string;
  pagination?: Pagination;
}

export class ApiResponse {
  message: string;
  statusCode: number;
  cookies?: Array<{ name: string; value: string }>;
  clearCookie?: string[];
  pagination?: Pagination;
  [key: string]: any;
  constructor({
    message,
    statusCode,
    cookies,
    clearCookie,
    data,
    fieldName,
    pagination,
  }: ApiResponseConstructorParams) {
    this.message = message;
    this.statusCode = statusCode;
    this.cookies = cookies;
    this.clearCookie = clearCookie;
    if (fieldName) this[fieldName] = data;
    this.pagination = pagination;
  }
}
