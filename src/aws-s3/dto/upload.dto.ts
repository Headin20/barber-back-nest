import * as Joi from 'joi';
import { ImageFileType, mimeTypes } from '../../const/mimeTypes';
import { ApiProperty } from '@nestjs/swagger';

export const uploadSchema = Joi.object({
  mimeType: Joi.string().valid(...Object.values(mimeTypes)),
});

export class UploadDto {
  @ApiProperty({
    example: mimeTypes.jpg,
  })
  readonly mimeType: ImageFileType;
}
