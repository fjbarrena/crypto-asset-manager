import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { LoginRequest } from './dtos/login.request';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({})
  async login(@Body() login: LoginRequest) {
    return this.securityService.login(login.username, login.plainPassword);
  }
}
