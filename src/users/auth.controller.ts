import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Res,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';

import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';

import { Cookies } from './decorators/cookie-decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmi(@CurrentUser() user: User) {
    return user;
  }
  @Post('/signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    this.authService.signout(res);
  }
  @Post('/refresh')
  async refresh(
    @Cookies() cookie: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: oldRefreshToken } = cookie || { refreshToken: null };
    const id =
      oldRefreshToken && this.tokenService.verifyAndExtractId(oldRefreshToken);
    if (!id) {
      throw new UnauthorizedException(
        'Refresh token invalid or does not exist, please login again.',
      );
    }
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(
        'No corresponding user to this id was found.',
      );
    }
    // Signs access and refresh tokens and attaches them to the response
    this.tokenService.signTokens({ id }, res);

    return user;
  }
  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signup(body, res);
    return user;
  }

  @Post('/signin')
  async signIn(
    @Body() body: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signin(body, res);
    return user;
  }
}
