import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { nanoid } from 'nanoid/async';
import { differenceInSeconds } from 'date-fns';
import { IRequest } from '@auth/interfaces/express';

import { AuthRepository } from '@auth/repositories/auth.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    public readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async validate(email: string, password: string): Promise<any> {
    const findOptions: Prisma.sessionFindFirstArgs = {
      where: { email: email },
      select: {
        id: true,
        email: true,
        password: true,
        user: { select: { id: true } },
        type: { select: { id: true, name: true } },
        rol: { select: { id: true, name: true } },
      },
    };
    const sessionInfo: any = await this.authRepo.getSessionInfo(findOptions);

    if (sessionInfo && compareSync(password, sessionInfo.password)) {
      await this.authRepo.updateMetadata(sessionInfo.id);

      return {
        id: sessionInfo.user.id,
        typeId: sessionInfo.type.id,
        rolId: sessionInfo.rol.id,
      };
    }

    return null;
  }

  public async login(sessionInfo: IRequest['user']): Promise<any> {
    const findOptions: Prisma.sessionFindFirstArgs = {
      where: { user: { id: sessionInfo.id } },
      select: {
        id: true,
        email: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            imgUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        type: { select: { id: true, name: true } },
        rol: { select: { id: true, name: true } },
      },
    };
    const fullSessionInfo: any = await this.authRepo.getSessionInfo(
      findOptions,
    );

    return {
      access_token: this.jwtService.sign(sessionInfo, {
        jwtid: await nanoid(),
      }),
      ...fullSessionInfo.user,
      email: fullSessionInfo.email,
      type: fullSessionInfo.type.name,
      rol: fullSessionInfo.rol.name,
    };
  }

  public async logout(req: IRequest) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken: any = this.jwtService.decode(token, { complete: true });
    const jti = decodeToken.payload.jti;
    const now = Date.now();
    const exp = decodeToken.payload.exp * 1000;
    const ttl = differenceInSeconds(exp, now);

    await this.cacheManager.set(jti, jti, { ttl });

    return { message: 'session closed successfully' };
  }

  public async getMyInfo(sessionInfo: IRequest['user']) {
    const findOptions: Prisma.sessionFindFirstArgs = {
      where: { user: { id: sessionInfo.id } },
      select: {
        id: true,
        email: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            imgUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        type: { select: { id: true, name: true } },
        rol: { select: { id: true, name: true } },
      },
    };

    const fullSessionInfo: any = await this.authRepo.getSessionInfo(
      findOptions,
    );

    return {
      ...fullSessionInfo.user,
      email: fullSessionInfo.email,
      type: fullSessionInfo.type.name,
      rol: fullSessionInfo.rol.name,
    };
  }
}
