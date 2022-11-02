import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { identityPrefix } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  identityCard: string;

  @IsString()
  identityCardPrefix: identityPrefix;

  @IsString()
  primaryPhone: string;

  @IsString()
  @IsOptional()
  secondaryPhone?: string;

  @IsNumber()
  rolId: number;
}
