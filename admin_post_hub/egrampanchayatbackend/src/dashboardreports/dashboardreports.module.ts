import { Module } from '@nestjs/common';
import { DashboardreportsService } from './dashboardreports.service';
import { DashboardreportsController } from './dashboardreports.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Admin, AdminSchema } from 'src/admins/schema/admins.schema';
import {
  Panchayat,
  PanchayatSchema,
} from 'src/panchayat/schema/panchayat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Panchayat.name, schema: PanchayatSchema },
    ]),
  ],
  controllers: [DashboardreportsController],
  providers: [DashboardreportsService],
})
export class DashboardreportsModule {}
