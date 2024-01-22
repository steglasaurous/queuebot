import { Injectable } from '@angular/core';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Injectable({
  providedIn: 'root',
})
export class JwtStoreService {
  constructor(private jwtPublicKey: string) {}

  getJwt(): string | null {
    // Check the JWT is still valid. If it's expired, then it's not useful.  We should toss it and
    // return null, which should lead to re-authenticating.
    const jwt = window.localStorage.getItem('user-jwt');
    if (!jwt) {
      return null;
    }

    try {
      jsonwebtoken.verify(jwt, this.jwtPublicKey);
    } catch (e) {
      // If it failed validation for any reason, consider it trash.
      return null;
    }

    return jwt;
  }

  getJwtPayload(): string | JwtPayload | null {
    const jwt = this.getJwt();
    if (!jwt) {
      return null;
    }

    return jsonwebtoken.decode(jwt);
  }

  setJwt(jwt: string): boolean {
    // Verify it's a valid jwt before setting it.
    if (!jsonwebtoken.verify(jwt, this.jwtPublicKey)) {
      return false;
    }

    window.localStorage.setItem('user-jwt', jwt);

    return true;
  }
}
