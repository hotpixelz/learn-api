import {
  Controller,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';

import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(AuthGuard)
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
