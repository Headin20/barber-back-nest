import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SessionsService } from './sessions/sessions.service';
import { SessionsModule } from './sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FavorsModule } from './favors/favors.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AppointmentsModule } from './appointments/appointments.module';

import * as dotenv from 'dotenv';
import { APP_FILTER } from '@nestjs/core';
import { HttpMongoExceptionFilter } from './common/http-mongo-exception.filter';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    UsersModule,
    SessionsModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '24h',
      },
    }),
    FavorsModule,
    AwsS3Module,
    AppointmentsModule,
  ],
  providers: [
    SessionsService,
    {
      provide: APP_FILTER,
      useClass: HttpMongoExceptionFilter,
    },
  ],
})
export class AppModule {}
