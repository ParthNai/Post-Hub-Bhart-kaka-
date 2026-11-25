import { Injectable } from '@nestjs/common';
import {
  AllHeaderQueryDto,
  CreateHeaderDto,
  HeaderQueryDto,
  UpdateHeaderDto,
} from './dto/header.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Header } from './schema/header.schema';
import { Model, PipelineStage } from 'mongoose';
import { getAggregatePaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class HeaderService {
  constructor(@InjectModel(Header.name) private header: Model<Header>) {}
  async create(createHeaderDto: CreateHeaderDto) {
    try {
      return await this.header.create(createHeaderDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: HeaderQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.header,
      pageQuery: Query,
      findQuery: headerQuery(Query),
      populate: [],
      pipeLines: headerPipeLine,
    });
  }

  async findAll(Query: AllHeaderQueryDto) {
    return await this.header.find(headerQuery(Query));
  }

  async findOne(id: string) {
    return await this.header.findById(id);
  }

  async update(updateHeaderDto: UpdateHeaderDto) {
    return await this.header
      .findByIdAndUpdate(updateHeaderDto._id, updateHeaderDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.header.findByIdAndDelete(id);
  }
}

const headerQuery = ({ title }: HeaderQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }

  return query;
};

export const headerPipeLine: PipelineStage[] = [
  {
    $lookup: {
      from: 'subheaders',
      let: { headerId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$headerId', '$$headerId'],
            },
          },
        },
      ],
      as: 'subheaders',
    },
  },
  {
    $addFields: {
      subHeaderCount: { $size: '$subheaders' },
    },
  },
  {
    $project: {
      subheaders: 0,
    },
  },
];
