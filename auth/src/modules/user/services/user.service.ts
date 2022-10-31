import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserRepository } from '@user/repositories/user.repository';

import { CreateUserDto } from '@user/dtos/create-user.dto';
import {
  AllUsersQueryParams,
  UserRolesQueryParams,
  UserStatusesQueryParams,
} from '@user/dtos/query-params.dto';
import {
  FindManySessionRolesArgs,
  FindManySessionStatusesArgs,
  FindManyUsersArgs,
} from '@user/types/find-many.types';
import { USER_BASE_ROUTE } from '@user/constants/routes.const';
import { UpdateUserDto } from '@user/dtos/update-user.dto';

@Injectable()
export class UserService {
  private userSelect: Prisma.userSelect = {
    id: true,
    name: true,
    lastName: true,
    identityCard: true,
    identityCardprefix: true,
    primaryPhone: true,
    secondaryPhone: true,
    createdAt: true,
    updatedAt: true,
    imgUrl: true,
    session: true,
  };

  constructor(private readonly userRepository: UserRepository) {}

  public async getAllUserRoles(queryParams: UserRolesQueryParams) {
    const findManyArgs: FindManySessionRolesArgs = {
      limit: queryParams.limit,
      page: queryParams.page,
      select: { id: true, name: true },
      where: { deletedAt: null },
    };

    const userRoles =
      await this.userRepository.findAll<FindManySessionRolesArgs>(
        this.userRepository.prismaService.session_rol,
        {
          paginate: true,
          resourceBaseUrl: USER_BASE_ROUTE + '/roles',
          findManyArgs,
        },
      );

    return userRoles;
  }

  public async getAllUserStatuses(queryParams: UserStatusesQueryParams) {
    const findManyArgs: FindManySessionStatusesArgs = {
      limit: queryParams.limit,
      page: queryParams.page,
      select: { id: true, name: true },
      where: { deletedAt: null },
    };

    const userStatuses =
      await this.userRepository.findAll<FindManySessionStatusesArgs>(
        this.userRepository.prismaService.session_status,
        {
          paginate: true,
          resourceBaseUrl: USER_BASE_ROUTE + '/statuses',
          findManyArgs,
        },
      );

    return userStatuses;
  }

  public async getAllUsers(queryParams: AllUsersQueryParams) {
    const responseData = [];
    const findManyArgs: FindManyUsersArgs = {
      limit: queryParams.limit,
      page: queryParams.page,
      select: this.userSelect,
      where: {
        deletedAt: null,
        ...(queryParams.search && {
          OR: this.userRepository.buildFilters(queryParams.search, [
            'name',
            'lastName',
            'identityCard',
          ]),
        }),
      },
      include: {
        session: {
          select: {
            email: true,
            rolId: true,
          },
        },
      },
    };

    const users = await this.userRepository.findAll<FindManyUsersArgs>(
      this.userRepository.prismaService.user,
      {
        paginate: true,
        resourceBaseUrl: USER_BASE_ROUTE,
        findManyArgs,
      },
    );

    for (const user of users.data) {
      responseData.push({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        identityCard: user.identityCard,
        identityCardprefix: user.identityCardprefix,
        email: user.session.email,
        rolId: user.session.rolId,
        primaryPhone: user.primaryPhone,
        secondaryPhone: user?.secondaryPhone || null,
        imgUrl: user?.imgUrl || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    const responseMeta = users.meta;

    return {
      data: responseData,
      meta: responseMeta,
    };
  }

  public async getUserById(id: number) {
    try {
      const findOneOptions: Prisma.userFindFirstArgs = {
        where: { id, deletedAt: null },
        select: this.userSelect,
        rejectOnNotFound: true,
      };

      const user = await this.userRepository.findOne<Prisma.userFindFirstArgs>(
        this.userRepository.prismaService.user,
        findOneOptions,
      );
      const response = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        identityCard: user.identityCard,
        identityCardprefix: user.identityCardprefix,
        primaryPhone: user.primaryPhone,
        secondaryPhone: user?.secondaryPhone || null,
        imgUrl: user.imgUrl,
        email: user.session.email,
        roleId: user.session.rolId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return response;
    } catch (error) {
      switch (error.name) {
        case 'NotFoundError':
          throw new BadRequestException(`No existe el usuario con el id ${id}`);

        default:
          console.log(error);
          throw new InternalServerErrorException(`Ocurrio un error inesperado`);
      }
    }
  }

  public async createUser(body: CreateUserDto) {
    const newUser = await this.userRepository.createUser({
      body,
      newResourceUrl: true,
    });

    return { message: 'Usuario creado con éxito', url: newUser.url };
  }

  public async updateUser(id: number, body: UpdateUserDto) {
    const updatedUser = await this.userRepository.updateUser({
      id,
      body,
      resourceUrl: true,
    });

    return { message: 'Usuario creado con éxito', url: updatedUser.url };
  }

  public async deleteUser(id: number) {
    try {
      await this.userRepository.softDelete(
        this.userRepository.prismaService.user,
        id,
      );

      return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
      switch (error.code) {
        case 'P2025':
          throw new BadRequestException(`No existe el usuario con el id ${id}`);

        default:
          console.log(error);
          throw new InternalServerErrorException({
            message: 'Ocurrio un error desconocido al borrar al usuario',
          });
      }
    }
  }
}
