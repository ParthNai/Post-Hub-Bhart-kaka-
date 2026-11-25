import { Injectable } from '@nestjs/common';
import {
  AllDistrictQueryDto,
  CreateDistrictDto,
  DistrictQueryDto,
  UpdateDistrictDto,
} from './dto/district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { District } from './schema/district.schema';
import { Model, PipelineStage } from 'mongoose';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';

@Injectable()
export class DistrictService {
  constructor(@InjectModel(District.name) private district: Model<District>) {}
  async create(createDistrictDto: CreateDistrictDto) {
    try {
      return await this.district.create(createDistrictDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: DistrictQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.district,
      pageQuery: Query,
      findQuery: districtQuery(Query),
      populate: [],
      pipeLines: districtPipeLine,
    });
  }

  async findAll(Query: AllDistrictQueryDto) {
    return await this.district.find(districtQuery(Query));
  }

  async findOne(id: string) {
    return await this.district.findById(id);
  }

  async update(updateDistrictDto: UpdateDistrictDto) {
    return await this.district
      .findByIdAndUpdate(updateDistrictDto._id, updateDistrictDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.district.findByIdAndDelete(id);
  }
}

const districtQuery = ({ name }: DistrictQueryDto) => {
  let query = {};

  if (name) {
    query = {
      ...query,

      name: { $regex: name, $options: 'i' },
    };
  }

  return query;
};

export const districtPipeLine: PipelineStage[] = [
  {
    $lookup: {
      from: 'talukas',
      let: { districtId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$districtId', '$$districtId'],
            },
          },
        },
      ],
      as: 'talukas',
    },
  },
  {
    $addFields: {
      talukaCount: { $size: '$talukas' },
    },
  },
  {
    $project: {
      talukas: 0,
    },
  },
  {
    $sort: {
      name: 1,
    },
  },
];
