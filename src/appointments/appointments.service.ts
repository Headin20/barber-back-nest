import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { Appointment } from './appointments.schema';
import { UsersService } from '../users/users.service';
import { FavorsService } from '../favors/favors.service';
import { CreateAppointmentDto } from './dto/appointment.create';
import { PaginationResult } from '../common/paginations/pagination.result';
import { AppointmentGetAllApiQuery } from './dto/appointment.getAll.apiQuery';
import { AppointmentGetFreePlaceApiQuery } from './dto/appointment.getFreePlace.apiQuery';
import { DAY_FORMAT, ISO_FORMAT } from '../const/timeFormat';
import { UpdateAppointmentDto } from './dto/appointment.update';

type TimeObject = {
  endTime: Date;
  time: Date;
};
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private usersService: UsersService,
    private favorService: FavorsService,
  ) {}

  generateFreeTimeByDay(day: Date): Date[] {
    const date = moment(day).format(DAY_FORMAT);
    const startTime = moment(`${date}T09:00:00.000Z`, ISO_FORMAT);
    const endTime = moment(`${date}T21:00:00.000Z`, ISO_FORMAT);

    const timeArray = [];

    while (startTime.isSameOrBefore(endTime)) {
      timeArray.push(startTime.toISOString());
      startTime.add(30, 'm');
    }

    return timeArray;
  }

  diffTimeArray(timeArray: Date[], bookedTime: any[]) {
    let availableTimeArray = [...timeArray];

    bookedTime.forEach(({ time, endTime }) => {
      availableTimeArray = availableTimeArray.filter((slot) => {
        const currentTime = moment(slot);
        return !(
          currentTime.isAfter(moment(time)) &&
          currentTime.isBefore(moment(endTime))
        );
      });
    });

    return availableTimeArray;
  }

  isTimeRangeAbsent(
    bookedTimeRanges: Appointment[],
    { time, endTime }: TimeObject,
  ) {
    const requestedStart = moment(time);
    const requestedEnd = moment(endTime);

    for (const bookedRange of bookedTimeRanges) {
      const bookedStart = moment(bookedRange.time);
      const bookedEnd = moment(bookedRange.endTime);

      if (
        !(
          requestedEnd.isSameOrBefore(bookedStart) ||
          requestedStart.isSameOrAfter(bookedEnd)
        )
      ) {
        return false;
      }
    }
    return true;
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    userId: Types.ObjectId,
  ): Promise<Appointment> {
    {
      const { performerId, favorId, time } = createAppointmentDto;

      const [user, performer, favor] = await Promise.all([
        this.usersService.getUserById(userId.toString()),
        this.usersService.getUserById(performerId),
        this.favorService.getOne(favorId),
      ]);

      const items = await this.getAppointmentsByDay(
        moment(time).utc().startOf('d').toDate(),
      );

      if (
        !this.isTimeRangeAbsent(items, {
          endTime: moment(time).utc().add(favor.time, 'm').toDate(),
          time: moment(time).toDate(),
        })
      ) {
        throw new HttpException('Time is busy', HttpStatus.BAD_REQUEST);
      }

      return this.appointmentModel.create({
        userId: user._id,
        performerId: performer._id,
        favorId: favor._id,
        endTime: moment(time).utc().add(favor.time, 'm'),
        time,
      });
    }
  }

  async getOne(id: string): Promise<Appointment> {
    const findItem = await this.appointmentModel.findById(id);
    if (!findItem) {
      throw new HttpException(
        `Appointment with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return findItem;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    clientId: Types.ObjectId,
  ): Promise<Appointment> {
    const { performerId, favorId, time } = updateAppointmentDto;

    const appointment = await this.getOne(id);

    if (!appointment.userId.equals(clientId)) {
      throw new HttpException('Not your appointment', HttpStatus.BAD_REQUEST);
    }

    const [performer, favor] = await Promise.all([
      this.usersService.getUserById(performerId),
      this.favorService.getOne(favorId),
    ]);

    const dateQuery = {
      $and: [
        {
          time: {
            $gte: moment(time).utc().startOf('d').toISOString(),
            $lte: moment(time).utc().endOf('d').toISOString(),
          },
        },
        {
          _id: { $ne: id },
        },
      ],
    };
    const items = await this.appointmentModel.find(dateQuery).exec();

    if (
      !this.isTimeRangeAbsent(items, {
        endTime: moment(time).utc().add(favor.time, 'm').toDate(),
        time: moment(time).toDate(),
      })
    ) {
      throw new HttpException('Time is busy', HttpStatus.BAD_REQUEST);
    }

    await this.appointmentModel.findByIdAndUpdate(id, {
      performerId: performer._id,
      favorId: favor._id,
      endTime: moment(time).utc().add(favor.time, 'm'),
      time,
    });

    return this.getOne(id);
  }

  async getAll(
    options: AppointmentGetAllApiQuery,
  ): Promise<PaginationResult<Appointment>> {
    const { limit, offset, startDate, endDate } = options;
    let dateQuery = {};

    if (startDate && endDate) {
      dateQuery = {
        time: {
          ...(startDate && {
            $gte: moment(startDate).startOf('d').utc().toISOString(),
          }),
          ...(endDate && {
            $lte: moment(endDate).endOf('d').utc().toISOString(),
          }),
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

  async getAppointmentsByDay(date: Date | string): Promise<Appointment[]> {
    const dateQuery = {
      time: {
        $gte: moment(date).utc().toISOString(),
        $lte: moment(date).utc().endOf('d').toISOString(),
      },
    };
    return this.appointmentModel.find(dateQuery).exec();
  }

  async getFreePlaces(options: AppointmentGetFreePlaceApiQuery) {
    const { date } = options;

    const items = await this.getAppointmentsByDay(date);

    return this.diffTimeArray(
      this.generateFreeTimeByDay(date).filter((time) =>
        moment(date).utc().isBefore(time),
      ),
      items,
    );
  }

  async getMyBookedAppointments(
    options: AppointmentGetAllApiQuery,
    userId: Types.ObjectId,
  ): Promise<PaginationResult<Appointment>> {
    const { limit, offset, startDate, endDate } = options;
    if (startDate && endDate) {
      throw new HttpException(
        '`startDate` and `endDate` is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dateQuery = {
      $and: [
        {
          time: {
            $gte: moment(startDate).startOf('d').utc().toISOString(),
            $lte: moment(endDate).endOf('d').utc().toISOString(),
          },
        },
        { userId: new Types.ObjectId(userId) },
      ],
    };

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

  async remove(id: string, userId: Types.ObjectId): Promise<void> {
    const appointment = await this.getOne(id);

    if (!appointment.userId.equals(userId)) {
      throw new HttpException('Not your appointment', HttpStatus.BAD_REQUEST);
    }

    this.appointmentModel.findByIdAndDelete(id);
    return;
  }
}
