import { ApiProperty } from '@nestjs/swagger';

export class AppointmentGetFreePlaceApiQuery {
  @ApiProperty({ required: false })
  date: Date;
}
