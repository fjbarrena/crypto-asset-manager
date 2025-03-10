import { createParamDecorator } from '@nestjs/common';
import { JwtTokenResponse } from 'src/modules/security/dtos/jwt-token.response';

export const JwtToken = createParamDecorator((data, req) => {
  return req.switchToHttp().getRequest().user as JwtTokenResponse;
});