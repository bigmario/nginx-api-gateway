import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';

export enum IdentityPrefix {
  J = 'J',
  G = 'G',
  V = 'V',
  E = 'E',
  C = 'C',
}

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
  identityCardPrefix: IdentityPrefix;

  @IsString()
  primaryPhone: string;

  @IsString()
  @IsOptional()
  secondaryPhone?: string;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsNumber()
  rolId: number;
}
