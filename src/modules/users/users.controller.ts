import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './users.service';
import { CreateUserRequest } from './dtos/create_user.request';

// @UseGuards(JwtGuard)
@ApiTags('users')
@ApiBearerAuth()
@ApiCookieAuth('crypto-cookie')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOperation({
    summary: 'Gets all users',
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('')
  @ApiOperation({
    summary: 'Creates an user',
  })
  async createUser(@Body() user: CreateUserRequest) {
    return this.userService.createUser(user);
  }
}
