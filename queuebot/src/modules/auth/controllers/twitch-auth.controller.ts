import { Controller, Get, Res, Inject, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

import {
  BASE_URL,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} from '../../../injection-tokens';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../data-store/services/user.service';
import { AuthSource } from '../../data-store/entities/user-auth-source.entity';

@Controller('auth/twitch')
export class TwitchAuthController {
  constructor(
    private authService: AuthService,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
    @Inject(JWT_EXPIRE_TIME) private jwtExpireTime: string,
    @Inject(TWITCH_CLIENT_ID) private twitchClientId: string,
    @Inject(TWITCH_CLIENT_SECRET) private twitchClientSecret: string,
    @Inject(BASE_URL) private baseUrl: string,
    private readonly httpService: HttpService,
    private userService: UserService,
  ) {}

  @Get('/')
  authTwitchStart(@Res() res: Response) {
    // FIXME: Make sure to store this somewhere to verify it when it returns.\
    const state = crypto.randomBytes(20).toString('hex');
    const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${this.twitchClientId}&redirect_uri=${this.baseUrl}/auth/twitch/return&state=${state}`;

    res.redirect(url);
  }

  @Get('/return')
  async authTwitchReturn(
    @Query('code') code: string,
    @Query('scope') scope: string,
    @Query('state')
    state: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    // FIXME: THis has ZERO error handling.  Need to add handling for:
    // - Error returned from twitch (user didn't authorize, redirect was incorrect, etc.)
    // - Code exchange failed
    // - API call to get user information failed.

    // Send server-server request to get actual oauth token.
    const oauthCodeResponse = await firstValueFrom(
      this.httpService.post('https://id.twitch.tv/oauth2/token', {
        client_id: this.twitchClientId,
        client_secret: this.twitchClientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${this.baseUrl}/auth/twitch/return`,
      }),
    );

    const tokenData = oauthCodeResponse.data;

    // Now use the token I got to get info about the user.
    const userInfo = await firstValueFrom(
      this.httpService.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: 'Bearer ' + tokenData.access_token,
          'Client-Id': this.twitchClientId,
        },
      }),
    );

    const user = await this.userService.loginUser(
      AuthSource.TWITCH,
      userInfo.data.data[0].id,
      userInfo.data.data[0].login,
      userInfo.data.data[0],
    );

    const authCode = this.authService.generateAuthCode();

    this.authService.storeAuthCodeJwt(authCode, this.authService.getJwt(user));

    response.cookie(this.jwtCookieName, this.authService.getJwt(user));

    // We'll need to detect what context we're working with, whether we're going back to electron, or going to launch this
    // thing in the browser.

    // For now, we're just spitting back one of these auth codes for the electron app to use.
    // FIXME: Replace this with a proper redirect when I work that out.

    //response.send(authCode);

    // Do electron redirect here.
    response.redirect(`requestobot://?authCode=${authCode}`);
    // response.redirect('/launch');
  }
}

// requestobot:///?authCode=dfd8deeb2bd471c7cc177cc40b19242b
