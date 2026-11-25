import { Injectable } from '@nestjs/common';
import {
  AllPanchayatRequestQueryDto,
  CreatePanchayatRequestDto,
  PanchayatRequestQueryDto,
  UpdatePanchayatRequestDto,
} from './dto/panchayatrequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PanchayatRequest } from './schema/panchayatrequest.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class PanchayatRequestService {
  constructor(
    @InjectModel(PanchayatRequest.name)
    private abhipray: Model<PanchayatRequest>,
  ) {}
  async create(createPanchayatRequestDto: CreatePanchayatRequestDto) {
    try {
      return await this.abhipray.create(createPanchayatRequestDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: PanchayatRequestQueryDto) {
    return await getPaginatedResponse({
      model: this.abhipray,
      pageQuery: Query,
      findQuery: abhiprayQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllPanchayatRequestQueryDto) {
    return await this.abhipray.find(abhiprayQuery(Query));
  }

  async findOne(id: string) {
    return await this.abhipray.findById(id);
  }

  async update(updatePanchayatRequestDto: UpdatePanchayatRequestDto) {
    return await this.abhipray
      .findByIdAndUpdate(
        updatePanchayatRequestDto._id,
        updatePanchayatRequestDto,
      )
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.abhipray.findByIdAndDelete(id);
  }
}

const abhiprayQuery = ({ mobile, gramname }: PanchayatRequestQueryDto) => {
  let query = {};

  if (mobile) {
    query = {
      ...query,

      mobile: { $regex: mobile, $options: 'i' },
    };
  }
  if (gramname) {
    query = {
      ...query,

      gramname: { $regex: gramname, $options: 'i' },
    };
  }
  return query;
};
