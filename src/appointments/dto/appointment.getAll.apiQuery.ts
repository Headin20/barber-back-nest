import { PaginationOptionsDto } from '../../common/paginations/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentGetAllApiQuery extends PaginationOptionsDto {
  constructor() {
    super();
  }

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;
}
