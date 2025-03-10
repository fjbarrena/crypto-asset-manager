import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { LoginRequest } from './dtos/login.request';
import { UserService } from '../users/users.service';
import { CreateUserRequest } from '../users/dtos/create_user.request';
import { UserResponse } from '../users/dtos/user.response';
import { isSuccess } from 'src/model/result.model';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({})
  async login(@Body() login: LoginRequest) {
    return this.securityService.login(login.username, login.plainPassword);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Allows users to create an account',
  })
  async createUser(@Body() user: CreateUserRequest): Promise<UserResponse> {
    const createdUser = await this.userService.createUser(user);

    if(isSuccess(createdUser)) {
      return UserResponse.fromEntity(createdUser.success);
    } else {
      throw createdUser.failure
    }
  }
}
