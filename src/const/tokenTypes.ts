import { Types } from 'mongoose';

export type TokenTypes = {
  _id: Types.ObjectId;
  login: string;
  role: number;
};
