import { Module } from '@nestjs/common';
import { PanchayatMemberService } from './panchayatmember.service';
import { PanchayatMemberController } from './panchayatmember.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PanchayatMember,
  PanchayatMemberSchema,
} from './schema/panchayatmember.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PanchayatMember.name, schema: PanchayatMemberSchema },
    ]),
  ],
  controllers: [PanchayatMemberController],
  providers: [PanchayatMemberService],
})
export class PanchayatMemberModule {}
