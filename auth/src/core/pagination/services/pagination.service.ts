import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  PaginateFunction,
  PaginateOptions,
} from '@core/pagination/types/pagination-types.types';
@Injectable()
export class PaginationService {
  constructor(private configService: ConfigService) {}

  public buildUrl(
    resourceId: number | bigint,
    resourceBaseUrl: string,
  ): string {
    const baseUrl: string = this.configService.get<string>('BASE_URL');

    return `${baseUrl}${resourceBaseUrl}/${resourceId}`;
  }

  public createPaginator(defaultOptions: PaginateOptions) {
    return async (model: any, args: any) => {
      const page = defaultOptions?.page || 1;
      const limit = defaultOptions?.limit || 10;

      const skip = page > 0 ? limit * (page - 1) : 0;
      const [totalItems, data] = await Promise.all([
        model.count({ where: args.where }),
        model.findMany({
          ...args,
          take: limit,
          skip,
        }),
      ]);
      const baseUrl: string = `${this.configService.get<string>('BASE_URL')}${
        defaultOptions.resourceBaseUrl
      }?`;
      const lastPageNumber: number = Math.ceil(totalItems / limit);
      const nextPageNumber: number = page < lastPageNumber ? page + 1 : null;
      const previosPageNumber: number = page > 1 ? page - 1 : null;
      const lastPageUrl: string = `${baseUrl}limit=${limit}&page=${lastPageNumber}`;
      const nextPageUrl: string =
        (nextPageNumber && `${baseUrl}limit=${limit}&page=${nextPageNumber}`) ||
        null;
      const previousPageUrl: string =
        (previosPageNumber &&
          `${baseUrl}limit=${limit}&page=${previosPageNumber}`) ||
        null;
      const firstPageUrl: string = `${baseUrl}limit=${limit}&page=${1}`;

      return {
        data,
        meta: {
          totalItems,
          page,
          limit,
          previousPageUrl,
          nextPageUrl,
          firstPageUrl,
          lastPageUrl,
        },
      };
    };
  }
}
