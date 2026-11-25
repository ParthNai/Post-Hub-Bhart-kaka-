import { Module } from '@nestjs/common';
import { UserComplaintService } from './usercomplaint.service';
import { UserComplaintController } from './usercomplaint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserComplaint,
  UserComplaintSchema,
} from './schema/usercomplaint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserComplaint.name, schema: UserComplaintSchema },
    ]),
  ],
  controllers: [UserComplaintController],
  providers: [UserComplaintService],
})
export class UserComplaintModule {}
