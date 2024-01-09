import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import controllers from '../const/controllers';
import { Roles, RolesGuard } from '../guards/jwt-role.quard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FavorsService } from './favors.service';
import { JoiValidationPipe } from '../common/validation.pipe';
import { createFavorSchema, FavorCreateDto } from './dto/favor.create';
import { Favor } from './favors.schema';
import roles from '../const/roles';
import {
  OpenApiPaginationResponse,
  Paginated,
} from '../common/paginations/pagination.decorator';
import { PaginationOptionsDto } from '../common/paginations/pagination.dto';
import { PaginationResult } from '../common/paginations/pagination.result';

@ApiTags(controllers.favors)
@Controller(controllers.favors)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class FavorsController {
  constructor(private readonly favorService: FavorsService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: Favor })
  @HttpCode(HttpStatus.CREATED)
  @Roles(roles.admin)
  @Post()
  @UsePipes(new JoiValidationPipe(createFavorSchema))
  createFavor(@Body() favorDto: FavorCreateDto): Promise<Favor> {
    return this.favorService.create(favorDto);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(roles.admin)
  @Delete(':id')
  removeFavor(@Param('id') id: string): Promise<void> {
    return this.favorService.remove(id);
  }

  @Roles(roles.admin)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @UsePipes(new JoiValidationPipe(createFavorSchema))
  updateFavor(
    @Param('id') id: string,
    @Body() favorDto: FavorCreateDto,
  ): Promise<Favor> {
    return this.favorService.update(id, favorDto);
  }

  @ApiResponse({ status: HttpStatus.OK, type: Favor })
  @Roles(roles.admin)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getOneFavor(@Param('id') id: string): Promise<Favor> {
    return this.favorService.getOne(id);
  }
  @OpenApiPaginationResponse(Favor)
  @Roles(roles.admin)
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiQuery({ type: PaginationOptionsDto })
  getAllFavors(
    @Paginated() options: PaginationOptionsDto,
  ): Promise<PaginationResult<Favor>> {
    return this.favorService.getAll(options);
  }
}
