import { Injectable } from '@nestjs/common';
import {
  AllSchemeQueryDto,
  CreateSchemeDto,
  SchemeQueryDto,
  UpdateSchemeDto,
} from './dto/scheme.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Scheme } from './schema/scheme.schema';
import { Model, PipelineStage } from 'mongoose';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';
import { createObjectId } from 'src/utils/string.utils';

@Injectable()
export class SchemeService {
  constructor(@InjectModel(Scheme.name) private scheme: Model<Scheme>) {}
  async create(createSchemeDto: CreateSchemeDto) {
    try {
      return await this.scheme.create(createSchemeDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: SchemeQueryDto) {
    return await getPaginatedResponse({
      model: this.scheme,
      pageQuery: Query,
      findQuery: schemeQuery(Query),
      populate: [],
      pipeLines: schemePipeLine,
    });
  }

  async findAll(Query: AllSchemeQueryDto) {
    return await this.scheme.find(schemeQuery(Query));
  }

  async findOne(id: string) {
    return await this.scheme.findById(id);
  }

  async update(updateSchemeDto: UpdateSchemeDto) {
    return await this.scheme
      .findByIdAndUpdate(updateSchemeDto._id, updateSchemeDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.scheme.findByIdAndDelete(id);
  }
}

const schemeQuery = ({ title, categoryId }: SchemeQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }
  if (categoryId) {
    query = {
      ...query,
      categoryId: createObjectId(categoryId),
    };
  }

  return query;
};

export const schemePipeLine: PipelineStage[] = [];
