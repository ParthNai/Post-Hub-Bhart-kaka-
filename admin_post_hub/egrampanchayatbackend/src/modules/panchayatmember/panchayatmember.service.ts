import { Injectable } from '@nestjs/common';
import {
  AllPanchayatMemberQueryDto,
  CreatePanchayatMemberDto,
  PanchayatMemberQueryDto,
  UpdatePanchayatMemberDto,
} from './dto/panchayatmember.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PanchayatMember } from './schema/panchayatmember.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class PanchayatMemberService {
  constructor(
    @InjectModel(PanchayatMember.name)
    private panchayatMember: Model<PanchayatMember>,
  ) {}
  async create(createPanchayatMemberDto: CreatePanchayatMemberDto) {
    try {
      return await this.panchayatMember.create(createPanchayatMemberDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: PanchayatMemberQueryDto) {
    return await getPaginatedResponse({
      model: this.panchayatMember,
      pageQuery: Query,
      findQuery: panchayatMemberQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllPanchayatMemberQueryDto) {
    return await this.panchayatMember.find(panchayatMemberQuery(Query));
  }

  async findOne(id: string) {
    return await this.panchayatMember.findById(id);
  }

  async update(updatePanchayatMemberDto: UpdatePanchayatMemberDto) {
    return await this.panchayatMember
      .findByIdAndUpdate(updatePanchayatMemberDto._id, updatePanchayatMemberDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.panchayatMember.findByIdAndDelete(id);
  }
}

const panchayatMemberQuery = ({
  panchayatId,
  name,
}: PanchayatMemberQueryDto) => {
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
