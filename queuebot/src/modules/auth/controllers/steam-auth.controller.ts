import {
  Controller,
  Get,
  HostParam,
  UseGuards,
  Request,
  Res,
  Inject,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { JWT_COOKIE_NAME, JWT_EXPIRE_TIME } from '../../injection-tokens';

@Controller('auth/steam')
export class SteamAuthController {
  constructor(
    private authService: AuthService,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
    @Inject(JWT_EXPIRE_TIME) private jwtExpireTime: string,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard('steam'))
  authSteamStart() {
    return;
  }

  @UseGuards(AuthGuard('steam'))
  @Get('/return')
  authSteamReturn(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Assign this to cookies.
    response.cookie(this.jwtCookieName, this.authService.getJwt(req.user));
    response.redirect('/launch');
  }
}
