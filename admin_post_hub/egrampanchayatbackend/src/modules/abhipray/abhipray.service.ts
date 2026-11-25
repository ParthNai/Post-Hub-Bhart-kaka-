import { Injectable } from '@nestjs/common';
import {
  AllAbhiprayQueryDto,
  CreateAbhiprayDto,
  AbhiprayQueryDto,
  UpdateAbhiprayDto,
} from './dto/abhipray.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Abhipray } from './schema/abhipray.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class AbhiprayService {
  constructor(@InjectModel(Abhipray.name) private abhipray: Model<Abhipray>) {}
  async create(createAbhiprayDto: CreateAbhiprayDto) {
    try {
      return await this.abhipray.create(createAbhiprayDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: AbhiprayQueryDto) {
    return await getPaginatedResponse({
      model: this.abhipray,
      pageQuery: Query,
      findQuery: abhiprayQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllAbhiprayQueryDto) {
    return await this.abhipray.find(abhiprayQuery(Query));
  }

  async findOne(id: string) {
    return await this.abhipray.findById(id);
  }

  async update(updateAbhiprayDto: UpdateAbhiprayDto) {
    return await this.abhipray
      .findByIdAndUpdate(updateAbhiprayDto._id, updateAbhiprayDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.abhipray.findByIdAndDelete(id);
  }
}

const abhiprayQuery = ({ name, panchayatId }: AbhiprayQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  }
  if (name) {
    query = {
      ...query,

      name: { $regex: name, $options: 'i' },
    };
  }
  return query;
};
