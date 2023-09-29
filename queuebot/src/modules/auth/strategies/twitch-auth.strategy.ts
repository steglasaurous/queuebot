import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitch';
import { Inject, Injectable } from '@nestjs/common';
import {
  BASE_URL,
  STEAM_APIKEY,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} from '../../../injection-tokens';
import { UserService } from '../../data-store/services/user.service';
import { AuthSource } from '../../data-store/entities/user-auth-source.entity';

@Injectable()
export class TwitchAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    @Inject(TWITCH_CLIENT_ID) twitchClientId: string,
    @Inject(TWITCH_CLIENT_SECRET) twitchClientSecret: string,
    @Inject(BASE_URL) baseUrl: string,
  ) {
    super({
      clientID: twitchClientId,
      clientSecret: twitchClientSecret,
      callbackURL: baseUrl + '/auth/twitch/return',
      scope: 'user_read',
    });
  }

  // Called upon successful validation - we use this to 'register' this user with our db.
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return await this.userService.loginUser(
      AuthSource.TWITCH,
      profile.id,
      profile.displayName,
      profile,
    );
  }
}
