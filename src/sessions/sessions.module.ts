import { Module } from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import { SessionsController } from './sessions.controller';
import {SessionsService} from "./sessions.service";
import {UsersModule} from "../users/users.module";

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [JwtModule, UsersModule],
})
export class SessionsModule {}
