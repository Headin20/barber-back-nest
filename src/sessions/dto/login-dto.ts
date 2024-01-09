import { ApiProperty } from '@nestjs/swagger';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../../const/rules';
import * as Joi from 'joi';

export const loginSchema = Joi.object({
  login: Joi.string().email().required(),
  password: Joi.string()
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH)
    .required(),
});

export class LoginDto {
  @ApiProperty({ example: 'test@test.com' })
  readonly login: string;

  @ApiProperty({ example: 'Qwerty12' })
  readonly password: string;
}
