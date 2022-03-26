import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { TokenService } from './token.service';
import { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}
  async signup(body: CreateUserDto, res: Response) {
    const { email, password } = body;
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email is already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({ ...body, password: result });

    this.tokenService.signTokens({ id: user.id }, res);

    return user;
  }
  async signin(body: SignInUserDto, res: Response) {
    const { email, password } = body;

    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password incorrect');
    }

    this.tokenService.signTokens({ id: user.id }, res);

    return user;
  }
  signout(res: Response) {
    this.tokenService.clearCookie(res);
  }
}
