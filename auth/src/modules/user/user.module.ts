import { Module } from '@nestjs/common';

import { PrismaModule } from '@core/prisma/prisma.module';
import { EmailModule } from '@core/email/email.module';

import { UserService } from '@user/services/user.service';
import { UserRepository } from '@user/repositories/user.repository';
import { UserController } from '@user/controllers/user.controller';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
