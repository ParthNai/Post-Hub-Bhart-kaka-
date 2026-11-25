import { Injectable } from '@nestjs/common';
import {
  AllSubHeaderQueryDto,
  CreateSubHeaderDto,
  SubHeaderQueryDto,
  UpdateSubHeaderDto,
} from './dto/subHeader.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubHeader } from './schema/subHeader.schema';
import { Model, PipelineStage } from 'mongoose';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';

@Injectable()
export class SubHeaderService {
  constructor(
    @InjectModel(SubHeader.name) private subHeader: Model<SubHeader>,
  ) {}
  async create(createSubHeaderDto: CreateSubHeaderDto) {
    try {
      return await this.subHeader.create(createSubHeaderDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: SubHeaderQueryDto) {
    return await getPaginatedResponse({
      model: this.subHeader,
      pageQuery: Query,
      findQuery: subHeaderQuery(Query),
      populate: [],
      pipeLines: subHeaderPipeLine,
    });
  }

  async findAll(Query: AllSubHeaderQueryDto) {
    return await this.subHeader.find(subHeaderQuery(Query));
  }

  async findOne(id: string) {
    return await this.subHeader.findById(id);
  }

  async update(updateSubHeaderDto: UpdateSubHeaderDto) {
    return await this.subHeader
      .findByIdAndUpdate(updateSubHeaderDto._id, updateSubHeaderDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.subHeader.findByIdAndDelete(id);
  }
}

const subHeaderQuery = ({ title, headerId }: SubHeaderQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }
  // if (headerId) {
  //   query = {
  //     ...query,
  //     headerId: headerId,
  //   };
  // }

  return query;
};

export const subHeaderPipeLine: PipelineStage[] = [];
