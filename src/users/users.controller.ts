import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import controllers from '../const/controllers';
import { createUserSchema, UserCreateDto } from './dto/user.create';
import { User } from './user.schema';
import { JoiValidationPipe } from '../common/validation.pipe';
import { Roles, RolesGuard } from '../guards/jwt-role.quard';
import roles from '../const/roles';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  OpenApiPaginationResponse,
  Paginated,
} from '../common/paginations/pagination.decorator';
import { PaginationOptionsDto } from '../common/paginations/pagination.dto';
import { PaginationResult } from '../common/paginations/pagination.result';

@ApiTags(controllers.users)
@Controller(controllers.users)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }

  @OpenApiPaginationResponse(User)
  @Roles(roles.admin)
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiQuery({ type: PaginationOptionsDto })
  async getAll(
    @Paginated() options: PaginationOptionsDto,
  ): Promise<PaginationResult<User>> {
    return this.usersService.findAll(options);
  }
}
