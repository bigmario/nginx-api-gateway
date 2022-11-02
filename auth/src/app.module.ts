import { Module, CacheModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { PaginationModule } from '@core/pagination/pagination.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { EmailModule } from '@core/email/email.module';

import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get(
          'REDIS_PORT',
        )}`,
        username: configService.get('REDIS_USERNAME'),
        password: configService.get('REDIS_PASSWORD'),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    PrismaModule,
    PaginationModule,
    UserModule,
    AuthModule,
    EmailModule,
    PaginationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
