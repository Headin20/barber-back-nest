import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

export const Roles = (...roles: number[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();

    try {
      if (!requiredRoles) {
        return true;
      }

      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException();
      }
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });
      const userRole = decodedToken.role;
      return requiredRoles.some((role) => userRole === role);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
