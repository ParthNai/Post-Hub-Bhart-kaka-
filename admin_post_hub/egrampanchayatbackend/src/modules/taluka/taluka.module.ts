import { Module } from '@nestjs/common';
import { TalukaService } from './taluka.service';
import { TalukaController } from './taluka.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Taluka, TalukaSchema } from './schema/taluka.schema';
import { District, DistrictSchema } from '../district/schema/district.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Taluka.name, schema: TalukaSchema },
      { name: District.name, schema: DistrictSchema },
    ]),
  ],
  controllers: [TalukaController],
  providers: [TalukaService],
})
export class TalukaModule {}
