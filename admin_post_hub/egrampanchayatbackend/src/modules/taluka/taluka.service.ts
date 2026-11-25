import { Injectable } from '@nestjs/common';
import {
  AllTalukaQueryDto,
  CreateTalukaDto,
  TalukaQueryDto,
  UpdateTalukaDto,
} from './dto/taluka.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Taluka } from './schema/taluka.schema';
import { Model, PipelineStage } from 'mongoose';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';
import { createObjectId } from 'src/utils/string.utils';

@Injectable()
export class TalukaService {
  constructor(@InjectModel(Taluka.name) private taluka: Model<Taluka>) {}
  async create(createTalukaDto: CreateTalukaDto) {
    try {
      return await this.taluka.create(createTalukaDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: TalukaQueryDto) {
    const pipeLines: PipelineStage[] = [
      {
        $sort: {
          name: 1,
        },
      },
    ];
    return await getAggregatePaginatedResponse({
      model: this.taluka,
      pageQuery: Query,
      findQuery: talukaQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllTalukaQueryDto) {
    return await this.taluka.find(talukaQuery(Query));
  }

  async findOne(id: string) {
    return await this.taluka.findById(id);
  }

  async update(updateTalukaDto: UpdateTalukaDto) {
    return await this.taluka
      .findByIdAndUpdate(updateTalukaDto._id, updateTalukaDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.taluka.findByIdAndDelete(id);
  }
}

const talukaQuery = ({ name, districtId }: TalukaQueryDto) => {
  let query = {};

  if (name) {
    query = {
      ...query,

      name: { $regex: name, $options: 'i' },
    };
  }
  if (districtId) {
    query = {
      ...query,

      districtId: createObjectId(districtId),
    };
  }
  return query;
};
