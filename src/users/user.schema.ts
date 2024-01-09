import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class User {
  _id?: Types.ObjectId;

  @Prop({
    unique: true,
  })
  login: string;

  @Prop()
  role: number;

  @Prop()
  password?: string;

  @Prop()
  bio?: string;

  @Prop()
  photo?: string;

  @Prop()
  birthdate?: Date;

  @Prop()
  gender?: number;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
