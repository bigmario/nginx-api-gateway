import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { PrismaService } from '@core/prisma/services/prisma.service';

import { CreateUserDto } from '@user/dtos/create-user.dto';
import { BaseCreateBodyDto } from '@core/dtos/base-create-body.dto';
import { USER_BASE_ROUTE } from '@user/constants/routes.const';
import { BaseRepository } from '@core/prisma/repositories/base.repository';
import { BaseUpdateBodyDto } from '@core/dtos/base-update-body.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(public readonly prismaService: PrismaService) {
    super();
  }
  public async updateUser(updateOptions: BaseUpdateBodyDto<UpdateUserDto>) {
    return this.prismaService.$transaction(
      async (prismaTransactionClient: Prisma.TransactionClient) => {
        const userData: Prisma.userUpdateArgs['data'] = {
          name: updateOptions.body.name,
          lastName: updateOptions.body.lastName,
          identityCard: updateOptions.body.identityCard,
          identityCardprefix: updateOptions.body.identityCardPrefix,
          primaryPhone: updateOptions.body.primaryPhone,
          secondaryPhone: updateOptions.body.secondaryPhone,
          imgUrl: updateOptions.body.imgUrl,
          session: {
            update: {
              email: updateOptions.body.email,
              rolId: updateOptions.body.rolId,
              password: hashSync(updateOptions.body.password, 10),
            },
          },
        };

        const updatedUser: any = await this.updateUserTransaction(
          updateOptions.id,
          userData,
          prismaTransactionClient,
        );

        if (updateOptions.resourceUrl) {
          const url: string = this.paginationService.buildUrl(
            updatedUser.id,
            USER_BASE_ROUTE,
          );

          updatedUser.url = url;
        }

        return updatedUser;
      },
    );
  }

  public async createUser(createOptions: BaseCreateBodyDto<CreateUserDto>) {
    return this.prismaService.$transaction(
      async (prismaTransactionClient: Prisma.TransactionClient) => {
        const sessionData: Prisma.sessionCreateArgs['data'] = {
          email: createOptions.body.email,
          password: hashSync(createOptions.body.password, 10),
          rolId: createOptions.body.rolId,
          typeId: 1,
          statusId: 1,
        };

        const newSession = await this.createSession(
          sessionData,
          prismaTransactionClient,
        );

        const userData: Prisma.userCreateArgs['data'] = {
          name: createOptions.body.name,
          lastName: createOptions.body.lastName,
          identityCard: createOptions.body.identityCard,
          identityCardprefix: createOptions.body.identityCardPrefix,
          primaryPhone: createOptions.body.primaryPhone,
          session: { connect: { id: newSession.id } },
        };

        const newUser: any = await this.createUserTransaction(
          userData,
          prismaTransactionClient,
        );

        if (createOptions.newResourceUrl) {
          const url: string = this.paginationService.buildUrl(
            newUser.id,
            USER_BASE_ROUTE,
          );

          newUser.url = url;
        }

        return newUser;
      },
    );
  }

  private async updateUserTransaction(
    id: number,
    userData: Prisma.userUpdateArgs['data'],
    prismaTransactionClient: Prisma.TransactionClient,
  ) {
    try {
      return await prismaTransactionClient.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Ocurrio un error',
        code: 'UU001',
      });
    }
  }

  private async createUserTransaction(
    userData: Prisma.userCreateArgs['data'],
    prismaTransactionClient: Prisma.TransactionClient,
  ) {
    try {
      return await prismaTransactionClient.user.create({
        data: userData,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Ocurrio un error',
        code: 'CU001',
      });
    }
  }

  private async createSession(
    sessionData: Prisma.sessionCreateArgs['data'],
    prismaTransactionClient: Prisma.TransactionClient,
  ) {
    try {
      return await prismaTransactionClient.session.create({
        data: sessionData,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Ocurrio un error',
        code: 'CS001',
      });
    }
  }
}
