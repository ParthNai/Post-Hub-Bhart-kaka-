import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import {
  AdminDto,
  AdminQueryDto,
  CreateAdminDto,
  UpdateAdminDto,
} from './dto/admins.dto';
import { Admin } from './schema/admins.schema';
import * as bcrypt from 'bcrypt';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';

const saltOrRounds = 10;
@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private admins: Model<Admin>) {}

  async create(data: CreateAdminDto) {
    try {
      const existing = await this.admins.findOne({ email: data.email });
      if (existing) {
        throw new ConflictException('Admin with same email  already exists');
      }
      const hash = await bcrypt.hash(data.password, saltOrRounds);

      await this.admins.create({
        ...data,

        role: data.role,

        password: hash,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(Query: AdminQueryDto) {
    console.log('findAll', Query);
    const pipeLineState: PipelineStage[] = [
      {
        $lookup: {
          from: 'panchayats',
          foreignField: '_id',
          localField: 'panchayatId',

          as: 'panchayat',
        },
      },
      {
        $unwind: {
          path: '$panchayat',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $addFields: { panchayatName: '$panchayat.name' } },
    ];
    return await getAggregatePaginatedResponse({
      model: this.admins,
      pageQuery: Query,
      findQuery: adminQuery(Query),
      pipeLines: pipeLineState,
      populate: [],
    });
  }

  async findOne(id: string) {
    console.log('findOne');

    return await this.admins.findById(id);
  }

  async update(updateThemeDto: UpdateAdminDto) {
    const admin = await this.admins.findById(updateThemeDto._id);

    return await this.admins
      .findByIdAndUpdate(updateThemeDto._id, {
        ...updateThemeDto,
      })
      .setOptions({ new: true });
    // throw new BadRequestException();
  }

  async remove(id: string) {
    return await this.admins.findByIdAndDelete(id);
  }

  async createMyAdmin(data: CreateAdminDto, user: AdminDto) {
    try {
      console.log('createMyAdmin', data);
      const existing = await this.admins.findOne({ email: data.email });
      if (existing) {
        throw new ConflictException('Admin with same email  already exists');
      }

      const hash = await bcrypt.hash(data.password, saltOrRounds);

      await this.admins.create({
        ...data,

        role: data.role,
        password: hash,
        // password: hash,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneMyAdmin(id: string, user: AdminDto) {
    return await this.admins.findOne({
      _id: id,
      panchayatId: user.panchayatId,
    });
  }

  async updateMyAdmin(updateThemeDto: UpdateAdminDto, user: AdminDto) {
    const admin = await this.admins.findById(updateThemeDto._id);

    return await this.admins
      .findByIdAndUpdate(updateThemeDto._id, {
        ...updateThemeDto,
      })
      .setOptions({ new: true });
    // throw new BadRequestException();
  }

  async removeMyAdmin(id: string, user: AdminDto) {
    return await this.admins.findByIdAndDelete(id);
  }
}

const adminQuery = ({ name, panchayatId }: AdminQueryDto) => {
  let query = {};
  // console.log('subRoles', subRoles);
  if (name) {
    query = {
      ...query,

      name: { $regex: name, $options: 'i' },
    };
  }

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: new mongoose.Types.ObjectId(panchayatId),
    };
  }

  return query;
};
