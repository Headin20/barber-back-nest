import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Appointment {
  @ApiProperty({
    example: '614f17a489c6d98123456789',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    example: '614f17a489c6d98123456789',
  })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({
    example: '614f17a489c6d98123456789',
  })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  performerId: Types.ObjectId;

  @ApiProperty({
    example: '614f17a489c6d98123456789',
  })
  @Prop({ type: Types.ObjectId, ref: 'Favor' })
  favorId: Types.ObjectId;

  @ApiProperty({ example: new Date() })
  @Prop()
  time: Date;

  @ApiProperty({ example: new Date() })
  @Prop()
  endTime: Date;
}

export type AppointmentDocument = HydratedDocument<Appointment>;
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
