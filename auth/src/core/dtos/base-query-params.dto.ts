import { IsNumber, IsOptional } from 'class-validator';

export class BaseQueryParams {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  page?: number;
}
