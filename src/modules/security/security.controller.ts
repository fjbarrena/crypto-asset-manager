import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { LoginRequest } from './dtos/login.request';
import { UserService } from '../users/users.service';
import { CreateUserRequest } from '../users/dtos/create_user.request';
import { UserResponse } from '../users/dtos/user.response';
import { isSuccess } from 'src/model/result.model';
import { LoginResponse } from './dtos/login.response';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Allows users to log in into the platform',
  })
  @ApiResponse({
    status: 200,
    description: `User logged in successfully`,
    type: LoginResponse,
  })
  @ApiResponse({
    status: 401,
    description: `User not valid or does not exists`,
  })
  async login(@Body() login: LoginRequest): Promise<LoginResponse> {
    return this.securityService.login(login.username, login.plainPassword);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Allows users to create an account',
  })
  @ApiResponse({
    status: 201,
    description: `User created successfully`,
    type: UserResponse,
  })
  async createUser(@Body() user: CreateUserRequest): Promise<UserResponse> {
    const createdUser = await this.userService.createUser(user);

    if (isSuccess(createdUser)) {
      return UserResponse.fromEntity(createdUser.success);
    } else {
      throw createdUser.failure;
    }
  }
}
