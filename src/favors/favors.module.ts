import { Module } from '@nestjs/common';
import { FavorsController } from './favors.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Favor, FavorsSchema } from './favors.schema';
import { FavorsService } from './favors.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: Favor.name, schema: FavorsSchema }]),
  ],
  providers: [FavorsService],
  controllers: [FavorsController],
})
export class FavorsModule {}
