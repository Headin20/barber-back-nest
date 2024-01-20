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
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

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
import { OpenApiPaginationResponse } from '../common/paginations/pagination.decorator';
import { PaginationResult } from '../common/paginations/pagination.result';
import { Appointment } from './appointments.schema';
import { AppointmentGetAllApiQuery } from './dto/appointment.getAll.apiQuery';
import { AppointmentGetFreePlaceApiQuery } from './dto/appointment.getFreePlace.apiQuery';
import {
  UpdateAppointmentDto,
  updateAppointmentSchema,
} from './dto/appointment.update';
import { DecodedToken } from '../common/decoded-token.decorator';
import { TokenTypes } from '../const/tokenTypes';

@ApiTags(controllers.appointments)
@Controller(controllers.appointments)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: Appointment })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(roles.user)
  @UsePipes(new JoiValidationPipe(createAppointmentSchema))
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @DecodedToken() decodedToken: TokenTypes,
  ) {
    const { _id } = decodedToken;
    return this.appointmentService.create(createAppointmentDto, _id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: Appointment })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Roles(roles.user)
  @UsePipes(new JoiValidationPipe(updateAppointmentSchema))
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @DecodedToken() decodedToken: TokenTypes,
  ): Promise<Appointment> {
    const { _id } = decodedToken;
    return this.appointmentService.update(id, updateAppointmentDto, _id);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(roles.user)
  @UsePipes(new JoiValidationPipe(updateAppointmentSchema))
  async remove(
    @Param('id') id: string,
    @DecodedToken() decodedToken: TokenTypes,
  ): Promise<void> {
    const { _id } = decodedToken;
    return this.appointmentService.remove(id, _id);
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

  @OpenApiPaginationResponse(Appointment)
  @Roles(roles.user)
  @HttpCode(HttpStatus.OK)
  @Get('/free')
  getFreePlacesAppointments(
    @Query() filterDto: AppointmentGetFreePlaceApiQuery,
  ) {
    return this.appointmentService.getFreePlaces(filterDto);
  }

  @OpenApiPaginationResponse(Appointment)
  @Roles(roles.user)
  @HttpCode(HttpStatus.OK)
  @Get('/my')
  getMyBookedAppointments(
    @Query() filterDto: AppointmentGetAllApiQuery,
    @DecodedToken() decodedToken: TokenTypes,
  ) {
    const { _id } = decodedToken;
    return this.appointmentService.getMyBookedAppointments(filterDto, _id);
  }
}
