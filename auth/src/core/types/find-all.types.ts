import { BaseQueryParams } from '@core/dtos/base-query-params.dto';

export type FindAllOptions<T> = {
  paginate: boolean;
  resourceBaseUrl: string;
  findManyArgs: FindManyArgs<T>;
};

export type FindManyArgs<T> = BaseQueryParams & T;
