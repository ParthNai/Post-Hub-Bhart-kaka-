import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePanchayatDto,
  PanchayatQueryDto,
  UpdatePanchayatDto,
} from './dto/panchayat.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Panchayat } from './schema/panchayat.schema';
import { Connection, Model, PipelineStage } from 'mongoose';
import { removeFileSync } from 'src/utils/removeFileSync';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';
import { Admin } from 'src/admins/schema/admins.schema';
import { ROLES } from 'src/admins/admin.enum';
import * as bcrypt from 'bcrypt';
import { createObjectId } from 'src/utils/string.utils';
import { PanchayatMember } from 'src/modules/panchayatmember/schema/panchayatmember.schema';
import { PANCHAYATMEMBEROCCUPATION } from 'src/modules/panchayatmember/enums/panchayatmember.enum';

const saltOrRounds = 10;

@Injectable()
export class PanchayatService {
  constructor(
    @InjectModel(Panchayat.name) private panchayat: Model<Panchayat>,
    @InjectModel(PanchayatMember.name)
    private panchayatMember: Model<PanchayatMember>,

    @InjectModel(Admin.name) private admin: Model<Admin>,

    @InjectConnection() private connection: Connection,
  ) {}
  async create(createPanchayatDto: CreatePanchayatDto) {
    console.log('createPanchayatDto', createPanchayatDto);
    // throw new NotFoundException('hehe');
    try {
      const findSubdomain = await this.panchayat.findOne({
        subDomain: createPanchayatDto.subDomain,
      });
      if (findSubdomain) {
        throw new BadRequestException(
          `This subdomain is already assigned to ${findSubdomain.name} Panchayat`,
        );
      }
      const panchayat = await this.panchayat.create(createPanchayatDto);

      // const findEmailAdmin = await this.admin.findOne({
      //   email: createPanchayatDto.adminEmail,
      // });
      // if (findEmailAdmin) {
      //   throw new BadRequestException(`This admin email is already assigned `);
      // }

      const findMobileAdmin = await this.admin.findOne({
        mobile: createPanchayatDto.adminMobile,
      });
      if (findMobileAdmin) {
        throw new BadRequestException(`This admin mobile is already assigned `);
      }

      const hash = await bcrypt.hash(
        createPanchayatDto.adminPassword,
        saltOrRounds,
      );
      const admin = await this.admin.create({
        // email: createPanchayatDto.adminEmail,
        name: createPanchayatDto.adminName,
        role: ROLES.PANCHAYATADMIN,

        isActive: true,
        mobile: createPanchayatDto.adminMobile,
        panchayatId: panchayat._id,
        password: hash,
      });

      const updated = await this.panchayat.findByIdAndUpdate(panchayat._id, {
        adminId: admin._id,
      });
      const membersToCreate = PANCHAYATMEMBEROCCUPATION.filter(
        (a) =>
          !['સામાજિક કાર્યકર્તા', 'વેબસાઈટ સ્પોન્સર', 'સભ્ય શ્રી'].includes(a),
      ).map((mem, memindex) => {
        return {
          createdBy: 'auto',
          isActive: true,
          mobile: '',
          name: ' ',
          occupation: mem,
          panchayatId: updated._id,
          position: memindex + 1,
        };
      });
      console.log('membersToCreate', membersToCreate);
      await this.panchayatMember.insertMany(membersToCreate);
      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: PanchayatQueryDto) {
    // return await this.panchayat.find();

    return await getAggregatePaginatedResponse({
      model: this.panchayat,
      pageQuery: Query,
      findQuery: panchayatQuery(Query),
      populate: [],
      pipeLines: panchayatPipeLine,
    });
  }

  async findAll(Query) {
    return await this.panchayat.find({ ...Query });
  }

  async findOne(id: string) {
    return await this.panchayat.findById(id);
  }

  async update(updatePanchayatDto: UpdatePanchayatDto) {
    console.log('updatePanchayatDto', updatePanchayatDto);
    // throw new BadRequestException();

    const updated = await this.panchayat
      .findByIdAndUpdate(updatePanchayatDto._id, updatePanchayatDto)
      .setOptions({ new: true });

    const findAdmin = await this.admin.findById(updated.adminId);

    // if (updatePanchayatDto.adminEmail) {
    //   await this.admin.findByIdAndUpdate(findAdmin._id, {
    //     email: updatePanchayatDto.adminEmail,
    //   });
    // }
    if (updatePanchayatDto.adminMobile) {
      await this.admin.findByIdAndUpdate(findAdmin._id, {
        mobile: updatePanchayatDto.adminMobile,
      });
    }
    if (updatePanchayatDto.adminName) {
      await this.admin.findByIdAndUpdate(findAdmin._id, {
        name: updatePanchayatDto.adminName,
      });
    }

    if (updatePanchayatDto.adminNewPassword) {
      const hash = await bcrypt.hash(
        updatePanchayatDto.adminNewPassword,
        saltOrRounds,
      );
      await this.admin.findByIdAndUpdate(findAdmin._id, {
        password: hash,
      });
    }
    // console.log('findAdmin', findAdmin);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.panchayat.findByIdAndDelete(id);

    const deleteAdmins = await this.admin.deleteMany({
      panchayatId: deleted._id,
    });

    removeFileSync(deleted?.logoPath);

    return deleted;
  }
}

const panchayatQuery = ({ name, isActive }: PanchayatQueryDto) => {
  let query = {};

  if (name) {
    query = {
      ...query,

      $or: [
        { name: { $regex: name, $options: 'i' } },
        { nameInGj: { $regex: name, $options: 'i' } },
      ],
    };
  }

  if (isActive) {
    query = {
      ...query,

      isActive: isActive,
    };
  }

  return query;
};
const panchayatPipeLine: PipelineStage[] = [
  {
    $lookup: {
      from: 'admins',
      let: { adminId: '$adminId' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$adminId'],
            },
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            mobile: 1,
          },
        },
      ],
      as: 'admin',
    },
  },
  {
    $unwind: {
      path: '$admin',
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $addFields: {
      adminName: '$admin.name',
      adminEmail: '$admin.email',
      adminMobile: '$admin.mobile',
    },
  },
  {
    $project: {
      admin: 0,
    },
  },

  {
    $lookup: {
      from: 'talukas',
      let: { talukaId: '$talukaId' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$talukaId'],
            },
          },
        },
      ],
      as: 'talukas',
    },
  },
  {
    $unwind: {
      path: '$talukas',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      taluka: '$talukas.name',
    },
  },
  {
    $project: {
      talukas: 0,
    },
  },

  {
    $lookup: {
      from: 'districts',
      let: { districtId: '$districtId' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$districtId'],
            },
          },
        },
      ],
      as: 'districts',
    },
  },
  {
    $unwind: {
      path: '$districts',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      district: '$districts.name',
    },
  },
  {
    $project: {
      districts: 0,
    },
  },
];
