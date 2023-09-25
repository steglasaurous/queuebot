import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getJwt(user: User) {
    const payload = {
      username: user.username,
      displayName: user.displayName,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
