import { Injectable } from '@nestjs/common';
import {
  AllUserAbhiprayQueryDto,
  CreateUserAbhiprayDto,
  UserAbhiprayQueryDto,
  UpdateUserAbhiprayDto,
} from './dto/userabhipray.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserAbhipray } from './schema/userabhipray.schema';
import { Model, PipelineStage } from 'mongoose';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';
import { createObjectId } from 'src/utils/string.utils';

@Injectable()
export class UserAbhiprayService {
  constructor(
    @InjectModel(UserAbhipray.name) private abhipray: Model<UserAbhipray>,
  ) {}
  async create(createUserAbhiprayDto: CreateUserAbhiprayDto) {
    try {
      return await this.abhipray.create(createUserAbhiprayDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: UserAbhiprayQueryDto) {
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
      model: this.abhipray,
      pageQuery: Query,
      findQuery: abhiprayQuery(Query),
      populate: [],
      pipeLines: pipeLineState,
    });
  }

  async findAll(Query: AllUserAbhiprayQueryDto) {
    return await this.abhipray.find(abhiprayQuery(Query));
  }

  async findOne(id: string) {
    return await this.abhipray.findById(id);
  }

  async update(updateUserAbhiprayDto: UpdateUserAbhiprayDto) {
    return await this.abhipray
      .findByIdAndUpdate(updateUserAbhiprayDto._id, updateUserAbhiprayDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.abhipray.findByIdAndDelete(id);
  }
}

const abhiprayQuery = ({ mobile, name, panchayatId }: UserAbhiprayQueryDto) => {
  let query = {};

  if (mobile) {
    query = {
      ...query,

      mobile: { $regex: mobile, $options: 'i' },
    };
  }
  if (name) {
    query = {
      ...query,

      name: { $regex: name, $options: 'i' },
    };
  }
  if (panchayatId) {
    query = {
      ...query,

      panchayatId: createObjectId(panchayatId),
    };
  }
  return query;
};
