import { Injectable } from '@nestjs/common';
import {
  AllSchemeCategoryQueryDto,
  CreateSchemeCategoryDto,
  SchemeCategoryQueryDto,
  UpdateSchemeCategoryDto,
} from './dto/schemecategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SchemeCategory } from './schema/schemecategory.schema';
import { Model, PipelineStage } from 'mongoose';
import { getAggregatePaginatedResponse } from 'src/utils/getPaginatedResponse';
import { Scheme } from './schema/scheme.schema';

@Injectable()
export class SchemeCategoryService {
  constructor(
    @InjectModel(SchemeCategory.name)
    private schemecategory: Model<SchemeCategory>,

    @InjectModel(Scheme.name)
    private scheme: Model<Scheme>,
  ) {}
  async create(createSchemeCategoryDto: CreateSchemeCategoryDto) {
    try {
      return await this.schemecategory.create(createSchemeCategoryDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: SchemeCategoryQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.schemecategory,
      pageQuery: Query,
      findQuery: schemecategoryQuery(Query),
      populate: [],
      pipeLines: schemecategoryPipeLine,
    });
  }

  async findAll(Query: AllSchemeCategoryQueryDto) {
    return await this.schemecategory.find(schemecategoryQuery(Query));
  }

  async findOne(id: string) {
    return await this.schemecategory.findById(id);
  }

  async update(updateSchemeCategoryDto: UpdateSchemeCategoryDto) {
    return await this.schemecategory
      .findByIdAndUpdate(updateSchemeCategoryDto._id, updateSchemeCategoryDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    const removed = await this.schemecategory.findByIdAndDelete(id);

    await this.scheme.deleteMany({ categoryId: removed._id });
    return removed;
  }
}

const schemecategoryQuery = ({ title }: SchemeCategoryQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }

  return query;
};

export const schemecategoryPipeLine: PipelineStage[] = [
  {
    $lookup: {
      from: 'schemes',
      let: { categoryId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$categoryId', '$$categoryId'],
            },
          },
        },
      ],
      as: 'schemes',
    },
  },
  {
    $addFields: {
      schemesCount: { $size: '$schemes' },
    },
  },
  {
    $project: {
      schemes: 0,
    },
  },
];
