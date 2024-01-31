import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JWT_COOKIE_NAME } from '../../../injection-tokens';
import { Request } from 'express';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Checking for stuffs');
    const request = context.switchToHttp().getRequest() as Request;
    console.log(request.cookies);
    const token = request.cookies[this.jwtCookieName];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.authService.verifyJwt(token);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
