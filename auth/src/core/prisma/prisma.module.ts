import { Module } from '@nestjs/common';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { PaginationModule } from '@core/pagination/pagination.module';
import { BaseRepository } from '@core/prisma/repositories/base.repository';

@Module({
  imports: [PaginationModule],
  providers: [PrismaService, BaseRepository],
  exports: [PrismaService, BaseRepository],
})
export class PrismaModule {}
