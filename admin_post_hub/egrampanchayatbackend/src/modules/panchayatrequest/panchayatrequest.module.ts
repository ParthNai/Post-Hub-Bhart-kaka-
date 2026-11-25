import { Module } from '@nestjs/common';
import { PanchayatRequestService } from './panchayatrequest.service';
import { PanchayatRequestController } from './panchayatrequest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PanchayatRequest,
  PanchayatRequestSchema,
} from './schema/panchayatrequest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PanchayatRequest.name, schema: PanchayatRequestSchema },
    ]),
  ],
  controllers: [PanchayatRequestController],
  providers: [PanchayatRequestService],
})
export class PanchayatRequestModule {}
