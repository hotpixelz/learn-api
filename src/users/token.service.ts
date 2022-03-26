import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

type TokenPayload = {
  id: string;
};

type DecodedToken = {
  id: string;
  iat: number;
  exp: number;
};

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  verify(token: string) {
    try {
      const { exp } = this.jwtService.verify(token) as DecodedToken;
      return exp * 1000 < Date.now();
    } catch (err) {
      return false;
    }
  }

  verifyAndExtractId(token: string): string | null {
    try {
      const { id } = this.jwtService.verify(token) as DecodedToken;
      return id;
    } catch (err) {
      return null;
    }
  }

  decode(token: string) {
    const { id } = (this.jwtService.decode(token) as DecodedToken) || {
      id: null,
    };
    return id;
  }

  signTokens(payload: TokenPayload, res: Response) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: 5 });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: 30 });
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 30000),
      httpOnly: false,
    });
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 60000),
      httpOnly: true,
    });
  }

  clearCookie(res: Response) {
    res.cookie('accessToken', '', {
      expires: new Date(Date.now()),
      httpOnly: false,
    });
    res.cookie('refreshToken', '', {
      expires: new Date(Date.now()),
      httpOnly: false,
    });
  }
}
