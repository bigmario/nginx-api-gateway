import { Injectable, OnModuleInit } from '@nestjs/common';

import { PaginationService } from '@core/pagination/services/pagination.service';
import { FindAllOptions } from '@core/types/find-all.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaseRepository implements OnModuleInit {
  public paginationService: PaginationService;

  onModuleInit() {
    this.paginationService = new PaginationService(new ConfigService());
  }

  public async findOne<T>(model: any, findOneArgs: T) {
    return model.findFirst({
      select: findOneArgs['select'],
      where: findOneArgs['where'],
      rejectOnNotFound: findOneArgs['rejectOnNotFound'] || false,
    });
  }

  public async findAll<T>(model: any, options: FindAllOptions<T>) {
    if (options.paginate) {
      return this.paginateQuery<T>(model, options);
    }

    return model.findMany({
      select: options.findManyArgs['select'],
      where: options.findManyArgs['where'],
    });
  }

  public async paginateQuery<T>(model: any, options: FindAllOptions<T>) {
    const paginate = this.paginationService.createPaginator({
      limit: options.findManyArgs.limit,
      page: options.findManyArgs.page,
      resourceBaseUrl: options.resourceBaseUrl,
    });

    return await paginate(model, {
      select: options.findManyArgs['select'],
      where: options.findManyArgs['where'],
    });
  }

  public async softDelete(model: any, id: number) {
    return await model.update({
      where: { id },
      select: { id: true },
      data: { deletedAt: new Date() },
    });
  }

  public buildFilters(search: string, columns: string[]) {
    const filterList = search.split(' ');
    const filtersBuilt = [];

    for (let column of columns) {
      for (let filter of filterList) {
        filtersBuilt.push({
          [column]: { contains: filter, mode: 'insensitive' },
        });
      }
    }

    return filtersBuilt;
  }
}
