import { PaginatedResult } from '@core/pagination/interfaces/paginate-result.interface';

export type PaginateOptions = {
  page: number;
  limit: number;
  resourceBaseUrl: string;
};

export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => PaginatedResult<T>;
