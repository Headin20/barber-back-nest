import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Favor {
  @ApiProperty({
    example: '614f17a489c6d98123456789',
  })
  _id: Types.ObjectId;

  @ApiProperty({ example: 'string' })
  @Prop()
  title: string;

  @ApiProperty({ example: 'string', required: false })
  @Prop()
  description?: string;

  @ApiProperty({ example: '42', description: 'in cents' })
  @Prop()
  price: number;

  @ApiProperty({ example: '42', description: 'in minutes' })
  @Prop()
  time: number;
}

export type FavorDocument = HydratedDocument<Favor>;
export const FavorsSchema = SchemaFactory.createForClass(Favor);
