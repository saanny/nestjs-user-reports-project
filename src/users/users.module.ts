import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.intercepor';

@Module({
  imports: [TypeOrmModule.forFeature([
    User
  ])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, { useClass: CurrentUserInterceptor, provide: APP_INTERCEPTOR }]
})
export class UsersModule { }
