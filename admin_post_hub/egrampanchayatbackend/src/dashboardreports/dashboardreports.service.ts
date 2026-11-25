import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admins/schema/admins.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

@Injectable()
export class DashboardreportsService {
  constructor(
    @InjectModel(Admin.name) private admin: Model<Admin>,
    @InjectModel(Panchayat.name)
    private panchayat: Model<Panchayat>,
  ) {}
  async getDashboard() {
    const totalAdmins = await this.admin.countDocuments();
    const totalPanchayat = await this.panchayat.countDocuments();

    return {
      totalAdmins,
      totalPanchayat,
    };
  }
}
