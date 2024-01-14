import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../const/rules';
import roles, { UserRole } from '../../const/roles';
import { GenderTypeEnum, genderTypes } from '../../const/genderTypes';

export const createUserSchema = Joi.object({
  login: Joi.string().email().required(),
  password: Joi.string()
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH)
    .required(),
  role: Joi.number().valid(roles.admin, roles.performers).required(),
  gender: Joi.number().valid(genderTypes.male, genderTypes.female),
  bio: Joi.string().min(MIN_DESCRIPTION_LENGTH).max(MAX_DESCRIPTION_LENGTH),
  photo: Joi.string().min(MIN_DESCRIPTION_LENGTH).max(MAX_DESCRIPTION_LENGTH),
  birthdate: Joi.date().min('1930-01-01').max('now').iso(),
}).options({ abortEarly: false });

export class UserCreateDto {
  @ApiProperty()
  readonly login: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty({ enum: UserRole, enumName: 'Roles' })
  readonly role: UserRole;

  @ApiProperty({ enum: GenderTypeEnum, enumName: 'Gender', required: false })
  readonly gender: GenderTypeEnum;

  @ApiProperty({ required: false })
  readonly bio: string;

  @ApiProperty({ required: false })
  readonly photo: string;

  @ApiProperty({ required: false, example: '1900-01-01' })
  readonly date: string;
}
