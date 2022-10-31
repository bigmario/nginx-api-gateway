import {
  CACHE_MANAGER,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';

import { AuthService } from '@auth/services/auth.service';

import { IS_PUBLIC_KEY } from '@auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    if (this.routeIsPublic(context)) {
      return true;
    }

    const tokenIsRevoked = await this.tokenIsRevoked(context);

    if (tokenIsRevoked) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    return super.canActivate(context);
  }

  private routeIsPublic(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return false;
  }

  private async tokenIsRevoked(context: ExecutionContext): Promise<boolean> {
    const contextArgs: any = context.getArgs();
    const authorizationHeader = contextArgs[0].headers?.authorization;

    if (!authorizationHeader) {
      return true;
    }

    const access_token = authorizationHeader.split(' ')?.[1];

    if (!access_token) {
      return true;
    }

    const isTokenRevoked = await this.tokenInBlacklist(access_token);

    if (isTokenRevoked) {
      return true;
    }

    return false;
  }

  private async tokenInBlacklist(access_token: string): Promise<boolean> {
    const decodeToken: any = this.authService.jwtService.decode(access_token);
    const jti = decodeToken.jti;

    return (await this.cacheManager.get(jti)) || false;
  }
}
