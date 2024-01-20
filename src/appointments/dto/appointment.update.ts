import * as Joi from 'joi';
import { createAppointmentSchema } from './appointment.create';
import { ApiProperty } from '@nestjs/swagger';

export const updateAppointmentSchema = Joi.object({
  time: createAppointmentSchema.extract('time'),
  performerId: createAppointmentSchema.extract('performerId'),
  favorId: createAppointmentSchema.extract('favorId'),
});

export class UpdateAppointmentDto {
  @ApiProperty({ example: '65a3f9dde144b85b6786090d' })
  readonly performerId: string;

  @ApiProperty({ example: '6590733a3fe52c1ec22c7f46' })
  readonly favorId: string;

  @ApiProperty({
    format: 'date-time',
    example: new Date().toISOString(),
  })
  readonly time: string;

  readonly userId: string;
}
