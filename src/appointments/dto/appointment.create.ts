import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import {
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  MILLISECONDS_PER_SECOND,
  MINUTES_PER_HOUR,
  SECONDS_PER_MINUTE,
} from '../../const/time';

const oneWeekInMilliseconds =
  DAYS_PER_WEEK *
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

export const createAppointmentSchema = Joi.object({
  time: Joi.date()
    .min('now')
    .max(new Date(new Date().getTime() + oneWeekInMilliseconds))
    .iso()
    .required(),
  performerId: Joi.string().required(),
  userId: Joi.string().required(),
  favorId: Joi.string().required(),
});

export class CreateAppointmentDto {
  @ApiProperty({ example: '65a3f9dde144b85b6786090d' })
  readonly performerId: string;

  @ApiProperty({ example: '6590733a3fe52c1ec22c7f46' })
  readonly favorId: string;

  @ApiProperty({
    format: 'date-time',
    example: new Date(
      new Date().getTime() + oneWeekInMilliseconds,
    ).toISOString(),
  })
  readonly time: string;
}
