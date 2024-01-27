import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { JWT_COOKIE_NAME } from '../../../injection-tokens';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserJwt } from '../models/user-jwt';

@Controller('auth-code/:authCode')
export class AuthCodeController {
  constructor(
    private authService: AuthService,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
  ) {}
  @Get('/')
  getAuthCode(
    @Param('authCode') authCode: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = this.authService.getJwtForAuthCode(authCode);
    if (!jwt) {
      res.status(404);
      res.send({ error: 'Invalid code' });
      return;
    }

    res.cookie(this.jwtCookieName, jwt);
    // Put the user's channel name in the result so it can be used for default channel, etc, in clients.
    const decodedJwt: jsonwebtoken.JwtPayload & UserJwt = jsonwebtoken.decode(
      jwt,
    ) as jsonwebtoken.JwtPayload & UserJwt;

    res.send({ status: 'OK', username: decodedJwt.username });
  }
}
