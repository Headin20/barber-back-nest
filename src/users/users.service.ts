import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { Model } from 'mongoose';
import * as crypt from 'bcryptjs';

import { UserCreateDto } from './dto/user.create';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationOptionsDto } from '../common/paginations/pagination.dto';
import { PaginationResult } from '../common/paginations/pagination.result';
import { UserUpdateDto } from './dto/user.update';

const NOT_FOUND_ERROR = (userId: string): string =>
  `User with ID ${userId} not found`;
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
      const newUser = await this.userModel.create({
        ...userCreateDto,
        password: hashPassword,
      });
      return this.getUserById(newUser.id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(userId: string, userUpdateDto: UserUpdateDto): Promise<User> {
    try {
      await this.userModel.findByIdAndUpdate(userId, userUpdateDto);
      return this.getUserById(userId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException(NOT_FOUND_ERROR(id));
    }
    return user;
  }

  async getUserByLogin(login: string): Promise<User> {
    try {
      return await this.userModel
        .findOne({ login: login })
        .select('-password')
        .exec();
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
