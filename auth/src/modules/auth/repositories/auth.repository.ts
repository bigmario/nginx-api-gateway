import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';
import { session } from 'passport';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getSessionInfo(findOptions: Prisma.sessionFindFirstArgs) {
    return await this.prismaService.session.findFirst(findOptions);
  }

  public async updateMetadata(sessionId: any) {
    await this.prismaService.session.update({
      where: { id: sessionId },
      data: { timesLoggedIn: { increment: 1 }, lastAccess: new Date() },
    });
  }
}
