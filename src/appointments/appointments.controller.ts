import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post, Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import controllers from '../const/controllers';
import { Roles, RolesGuard } from '../guards/jwt-role.quard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import roles from '../const/roles';
import { JoiValidationPipe } from '../common/validation.pipe';
import {
  CreateAppointmentDto,
  createAppointmentSchema,
} from './dto/appointment.create';
import {
  OpenApiPaginationResponse,
  Paginated,
} from '../common/paginations/pagination.decorator';
import { PaginationOptionsDto } from '../common/paginations/pagination.dto';
import { PaginationResult } from '../common/paginations/pagination.result';
import { Appointment } from './appointments.schema';
import { AppointmentGetAllApiQuery } from './dto/appointment.getAll.apiQuery';

@ApiTags(controllers.appointments)
@Controller(controllers.appointments)
// @ApiBearerAuth()
// @UseGuards(RolesGuard)
// @UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post()
  @Roles(roles.user)
  @UsePipes(new JoiValidationPipe(createAppointmentSchema))
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @OpenApiPaginationResponse(Appointment)
  @Roles(roles.user)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllAppointments(
    @Query() filterDto: AppointmentGetAllApiQuery,
  ): Promise<PaginationResult<Appointment>> {
    return this.appointmentService.getAll(filterDto);
  }
}
