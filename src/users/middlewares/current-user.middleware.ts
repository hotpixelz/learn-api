/* eslint-disable @typescript-eslint/no-namespace */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../token.service';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
      groups?: string[];
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { accessToken } = req.cookies || { accessToken: null };
    const id = this.tokenService.verifyAndExtractId(accessToken);
    if (id) {
      const user = await this.usersService.findOne(id);
      req.currentUser = user;
    }
    next();
  }
}
