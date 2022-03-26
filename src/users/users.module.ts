import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

import { User } from './user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
        };
      },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, TokenService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
