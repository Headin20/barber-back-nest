import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_ESTIMATION,
  MAX_PRICE,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_ESTIMATION,
  MIN_PRICE,
  MIN_TITLE_LENGTH,
} from '../../const/rules';

export const createFavorSchema = Joi.object({
  title: Joi.string().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH).required(),
  price: Joi.number().min(MIN_PRICE).max(MAX_PRICE).required(),
  time: Joi.number().min(MIN_ESTIMATION).max(MAX_ESTIMATION).required(),
  description: Joi.string()
    .min(MIN_DESCRIPTION_LENGTH)
    .max(MAX_DESCRIPTION_LENGTH),
});

export class FavorCreateDto {
  @ApiProperty()
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ description: 'in cents' })
  readonly price: number;

  @ApiProperty({ description: 'in minutes' })
  readonly time: number;
}
