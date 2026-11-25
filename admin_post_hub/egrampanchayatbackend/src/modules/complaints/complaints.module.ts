import { Module } from '@nestjs/common';
import { ComplaintService } from './complaints.service';
import { ComplaintController } from './complaints.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Complaint, ComplaintSchema } from './schema/complaints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
    ]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
