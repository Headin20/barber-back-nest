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
  @ApiProperty({ example: '65898beca1ea76d997a47b0b' })
  readonly performerId: string;

  @ApiProperty({ example: '65898beca1ea76d997a47b0b' })
  readonly userId: string;

  @ApiProperty({ example: '65898beca1ea76d997a47b0b' })
  readonly favorId: string;

  @ApiProperty({
    format: 'date-time',
    example: new Date(
      new Date().getTime() + oneWeekInMilliseconds,
    ).toISOString(),
  })
  readonly time: string;
}
