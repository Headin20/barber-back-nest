import * as Joi from 'joi';
import roles from '../../const/roles';
import { createUserSchema } from '../../users/dto/user.create';

export const registerSchema = createUserSchema
  .keys({
    role: Joi.number().valid(roles.user).required(),
  })
  .options({ abortEarly: false });
