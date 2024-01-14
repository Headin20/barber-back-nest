import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../const/roles';
import * as Joi from 'joi';
import { GenderTypeEnum } from '../../const/genderTypes';
import { createUserSchema } from './user.create';

export const updateUserSchema = Joi.object({
  role: createUserSchema.extract('role'),
  gender: createUserSchema.extract('gender'),
  bio: createUserSchema.extract('bio'),
  photo: createUserSchema.extract('photo'),
  birthdate: createUserSchema.extract('birthdate'),
}).options({ abortEarly: false });

export class UserUpdateDto {
  @ApiProperty({ enum: UserRole, enumName: 'Roles' })
  readonly role: UserRole;

  @ApiProperty({ enum: GenderTypeEnum, enumName: 'Gender', required: false })
  readonly gender: GenderTypeEnum;

  @ApiProperty({ required: false })
  readonly bio: string;

  @ApiProperty({ required: false })
  readonly photo: string;

  @ApiProperty({ required: false, example: '1900-01-01' })
  readonly birthdate: string;
}
