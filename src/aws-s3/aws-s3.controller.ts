import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import controllers from '../const/controllers';
import { Roles, RolesGuard } from '../guards/jwt-role.quard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AwsS3Service } from './aws-s3.service';
import roles from '../const/roles';
import { JoiValidationPipe } from '../common/validation.pipe';
import { UploadDto, uploadSchema } from './dto/upload.dto';

@ApiTags(controllers.files)
@Controller(controllers.files)
// @ApiBearerAuth()
// @UseGuards(RolesGuard)
// @UseGuards(JwtAuthGuard)
export class AwsS3Controller {
  constructor(private readonly fileService: AwsS3Service) {}
  @HttpCode(HttpStatus.CREATED)
  //@Roles(roles.admin)
  @Post()
  @UsePipes(new JoiValidationPipe(uploadSchema))
  async uploadFile(@Body() mimeType: UploadDto): Promise<string> {
    return this.fileService.uploadFile(mimeType);
  }
}
