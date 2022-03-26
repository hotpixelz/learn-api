import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  expiresIn: number;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.expiresIn = Number(this.configService.get<string>('JWT_EXPIRES_IN'));
  }

  verify(token: string) {
    try {
      this.jwtService.verify(token) as DecodedToken;
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
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.expiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.expiresIn * 2,
    });
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + this.expiresIn * 1000),
      httpOnly: false,
    });
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + this.expiresIn * 2000),
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
