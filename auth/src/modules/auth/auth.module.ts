import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { AuthRepository } from '@auth/repositories/auth.repository';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        let configService: ConfigService = new ConfigService();

        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
