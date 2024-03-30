import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../data-store/entities/user.entity';
import * as crypto from 'crypto';
import { UserJwt } from '../models/user-jwt';
import { Cron } from '@nestjs/schedule';

interface AuthCodeJwt {
  authCode: string;
  jwt: string;
  timestamp: number;
}

@Injectable()
export class AuthService {
  // When generating a state value to pass through an authentication process,
  // this stores that value along with any key/value pairs one might wish to associate with it
  // Ex: Setting a value to indicate this is a web-based sign-in (for dev) vs opening the
  // requestobot app
  private stateMap: Map<string, Map<string, string>> = new Map<
    string,
    Map<string, string>
  >();
  private authCodes: Map<string, AuthCodeJwt> = new Map<string, AuthCodeJwt>();
  private authCodeTtl = 300000; // 5 minutes in ms
  private stateValueTtl = 300000;
  private logger: Logger = new Logger(this.constructor.name);

  constructor(private jwtService: JwtService) {}

  generateStateValue(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  storeState(stateValue: string, keyValues: Map<string, string>) {
    // Tack on a timestamp so we know when to expire state info.
    keyValues.set('timestamp', Date.now().toString());
    this.stateMap.set(stateValue, keyValues);
  }

  getState(
    stateValue: string,
    invalidateState = true,
  ): Map<string, string> | undefined {
    if (this.stateMap.has(stateValue)) {
      const stateKeyValues = this.stateMap.get(stateValue);
      if (invalidateState) {
        this.stateMap.delete(stateValue);
      }
      return stateKeyValues;
    }

    return undefined;
  }
  generateAuthCode(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  storeAuthCodeJwt(authCode: string, jwt: string) {
    this.authCodes.set(authCode, {
      authCode: authCode,
      jwt: jwt,
      timestamp: Date.now(),
    });
  }

  /**
   * Returns the JWT for the given auth code.  Note that if successful, this will delete the authcode from the list.
   */
  getJwtForAuthCode(authCode: string): string | undefined {
    if (this.authCodes.has(authCode)) {
      const jwt = this.authCodes.get(authCode).jwt;
      this.authCodes.delete(authCode);

      return jwt;
    }

    return undefined;
  }

  getJwt(user: User) {
    const payload: UserJwt = {
      username: user.username,
      displayName: user.displayName,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }

  verifyJwt(jwt: string): UserJwt {
    return this.jwtService.verify<UserJwt>(jwt);
  }

  @Cron('* * * * *')
  cleanAuthCodes() {
    const now = Date.now();
    this.authCodes.forEach((jwtItem, key) => {
      if (now - jwtItem.timestamp > this.authCodeTtl) {
        this.authCodes.delete(key);
        this.logger.debug('Removed authCode from list');
      }
    });
  }

  @Cron('* * * * *')
  cleanStateMap() {
    const now = Date.now();
    this.stateMap.forEach((keyValues, stateValue) => {
      if (now - parseInt(keyValues.get('timestamp')) > this.stateValueTtl) {
        this.stateMap.delete(stateValue);
        this.logger.debug('Removed state from list');
      }
    });
  }
}
