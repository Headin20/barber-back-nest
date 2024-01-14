import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Appointment } from './appointments.schema';
import { UsersService } from '../users/users.service';
import { FavorsService } from '../favors/favors.service';
import { CreateAppointmentDto } from './dto/appointment.create';
import { PaginationResult } from '../common/paginations/pagination.result';
import { AppointmentGetAllApiQuery } from './dto/appointment.getAll.apiQuery';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private usersService: UsersService,
    private favorService: FavorsService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    {
      const { userId, performerId, favorId, time } = createAppointmentDto;

      try {
        const [user, performer, favor] = await Promise.all([
          this.usersService.getUserById(userId),
          this.usersService.getUserById(performerId),
          this.favorService.getOne(favorId),
        ]);

        return this.appointmentModel.create({
          userId: user._id,
          performerId: performer._id,
          favorId: favor._id,
          time,
        });
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async getAll(
    options: AppointmentGetAllApiQuery,
  ): Promise<PaginationResult<Appointment>> {
    const { limit, offset, startDate, endDate } = options;
    let dateQuery = {};

    if (startDate && endDate) {
      dateQuery = {
        time: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && { $lte: new Date(endDate) }),
        },
      };
    }
    const items = await this.appointmentModel
      .find(dateQuery)
      .limit(limit)
      .skip(offset)
      .exec();
    const totalItems = await this.appointmentModel
      .countDocuments(dateQuery)
      .exec();

    return new PaginationResult({
      items,
      limit,
      offset,
      totalItems,
    });
  }
}
