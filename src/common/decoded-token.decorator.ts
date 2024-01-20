import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenTypes } from '../const/tokenTypes';

export const DecodedToken = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<TokenTypes> => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService({ secret: process.env.PRIVATE_KEY });

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      return await jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  },
);
