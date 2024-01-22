import * as jsonwebtoken from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import * as Store from 'electron-store';
import * as fs from 'fs';

export class JwtStoreService {
  constructor(
    private jwtPublicKey: string,
    private jwtFilePath: string,
  ) {}

  getJwt(): string | null {
    // Check the JWT is still valid. If it's expired, then it's not useful.  We should toss it and
    // return null, which should lead to re-authenticating.
    if (!fs.existsSync(this.jwtFilePath)) {
      return null;
    }
    const jwt = fs.readFileSync(this.jwtFilePath).toString();
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

    fs.writeFileSync(this.jwtFilePath, jwt);

    return true;
  }
}
