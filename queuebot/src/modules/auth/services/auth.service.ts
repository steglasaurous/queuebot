import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../data-store/entities/user.entity';
import * as crypto from 'crypto';
import { UserJwt } from '../models/user-jwt';

interface AuthCodeJwt {
  authCode: string;
  jwt: string;
  timestamp: number;
}

@Injectable()
export class AuthService {
  private authCodes: Map<string, AuthCodeJwt> = new Map<string, AuthCodeJwt>();
  private authCodeTtl = 300000; // 5 minutes in ms
  private logger: Logger = new Logger(this.constructor.name);

  constructor(private jwtService: JwtService) {}

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

  cleanAuthCodes() {
    const now = Date.now();
    this.authCodes.forEach((jwtItem, key) => {
      if (now - jwtItem.timestamp > this.authCodeTtl) {
        this.authCodes.delete(key);
        this.logger.debug('Removed authCode from list');
      }
    });
  }
}
