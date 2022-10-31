import { BaseQueryParams } from '@core/dtos/base-query-params.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserRolesQueryParams extends BaseQueryParams {}

export class UserStatusesQueryParams extends BaseQueryParams {}

export class AllUsersQueryParams extends BaseQueryParams {
  @IsString()
  @IsOptional()
  search?: string;
}
