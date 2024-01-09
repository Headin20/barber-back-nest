import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SessionsService } from './sessions/sessions.service';
import { SessionsModule } from './sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FavorsModule } from './favors/favors.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';

import * as dotenv from 'dotenv';

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
  ],
  providers: [SessionsService],
})
export class AppModule {}
