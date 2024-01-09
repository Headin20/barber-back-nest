import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as crypt from 'bcryptjs';

import { UserCreateDto } from './dto/user.create';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationOptionsDto } from '../common/paginations/pagination.dto';
import { PaginationResult } from '../common/paginations/pagination.result';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<User> {
    const user = await this.getUserByLogin(userCreateDto.login);

    if (user) {
      throw new HttpException(
        'User with this login exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await crypt.hash(userCreateDto.password, 10);
    try {
      return this.userModel
        .create({
          ...userCreateDto,
          password: hashPassword,
        })
        .then((createdUser) => {
          const user = createdUser.toObject({ getters: true });
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserByLogin(login: string): Promise<User> {
    try {
      return await this.userModel.findOne({ login: login }).exec();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(
    options: PaginationOptionsDto,
  ): Promise<PaginationResult<User>> {
    const { limit, offset } = options;
    const items = await this.userModel
      .find()
      .limit(limit)
      .skip(offset)
      .select('-password')
      .exec();
    const totalItems = await this.userModel.countDocuments().exec();

    return new PaginationResult({
      items,
      limit,
      offset,
      totalItems,
    });
  }
}
