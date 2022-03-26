import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Res,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

import { SignInUserDto } from './dtos/sign-in-user.dto';
import { Response } from 'express';
import { TokenService } from './token.service';
import { Cookies } from './decorators/cookie-decorator';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
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
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
