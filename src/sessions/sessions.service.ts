import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypt from 'bcryptjs';

import { LoginDto } from './dto/login-dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';
import {UserCreateDto} from "../users/dto/user.create";

@Injectable()
export class SessionsService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private async generateToken(user: User): Promise<{ token: string }> {
    const { login, role, _id } = user;
    const payload = { _id, login, role };
    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.PRIVATE_KEY,
      }),
    };
  }

  private async validateUser(userDto: LoginDto): Promise<User> {
    const user = await this.usersService.getUserByLogin(userDto.login);
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid login or password' });
    }
    const passEquals = await crypt.compare(userDto.password, user.password);
    if (user && passEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Invalid login or password' });
  }

  async register(createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }
}
