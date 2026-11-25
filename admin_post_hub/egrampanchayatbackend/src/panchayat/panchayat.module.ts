import { Module } from '@nestjs/common';
import { PanchayatService } from './panchayat.service';
import { PanchayatController } from './panchayat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Panchayat, PanchayatSchema } from './schema/panchayat.schema';
import { Admin, AdminSchema } from 'src/admins/schema/admins.schema';
import {
  PanchayatMember,
  PanchayatMemberSchema,
} from 'src/modules/panchayatmember/schema/panchayatmember.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Panchayat.name, schema: PanchayatSchema },
      { name: PanchayatMember.name, schema: PanchayatMemberSchema },

      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [PanchayatController],
  providers: [PanchayatService],
})
export class PanchayatModule {}
