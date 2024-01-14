import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favor } from './favors.schema';
import { FavorCreateDto } from './dto/favor.create';
import { PaginationOptionsDto } from '../common/paginations/pagination.dto';
import { PaginationResult } from '../common/paginations/pagination.result';

const NOT_FOUND_ERROR = (favorId: string): string =>
  `Favor with ID ${favorId} not found`;

@Injectable()
export class FavorsService {
  constructor(
    @InjectModel(Favor.name) private readonly favorModel: Model<Favor>,
  ) {}
  async create(createFavorDto: FavorCreateDto): Promise<Favor> {
    try {
      return this.favorModel.create(createFavorDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOne(favorId: string): Promise<Favor> {
    const findItem = await this.favorModel.findById(favorId);
    if (!findItem) {
      throw new NotFoundException(NOT_FOUND_ERROR(favorId));
    }
    return findItem;
  }

  async getAll(
    options: PaginationOptionsDto,
  ): Promise<PaginationResult<Favor>> {
    const { limit, offset } = options;
    const items = await this.favorModel.find().limit(limit).skip(offset).exec();
    const totalItems = await this.favorModel.countDocuments().exec();

    return new PaginationResult({
      items,
      limit,
      offset,
      totalItems,
    });
  }
  async remove(favorId: string): Promise<void> {
    const deletedFavor = await this.favorModel.findByIdAndDelete(favorId);
    if (!deletedFavor) {
      throw new NotFoundException(NOT_FOUND_ERROR(favorId));
    }
  }
  async update(
    favorId: string,
    updateFavorDto: FavorCreateDto,
  ): Promise<Favor> {
    const updatedFavor = await this.favorModel.findByIdAndUpdate(
      favorId,
      updateFavorDto,
    );
    if (!updatedFavor) {
      throw new NotFoundException(NOT_FOUND_ERROR(favorId));
    }
    return this.getOne(favorId);
  }
}
