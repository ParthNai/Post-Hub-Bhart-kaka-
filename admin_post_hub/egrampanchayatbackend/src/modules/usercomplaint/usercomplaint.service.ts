import { Injectable } from '@nestjs/common';
import {
  AllUserComplaintQueryDto,
  CreateUserComplaintDto,
  UserComplaintQueryDto,
  UpdateUserComplaintDto,
} from './dto/usercomplaint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserComplaint } from './schema/usercomplaint.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class UserComplaintService {
  constructor(
    @InjectModel(UserComplaint.name)
    private abhipray: Model<UserComplaint>,
  ) {}
  async create(createUserComplaintDto: CreateUserComplaintDto) {
    try {
      return await this.abhipray.create(createUserComplaintDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: UserComplaintQueryDto) {
    return await getPaginatedResponse({
      model: this.abhipray,
      pageQuery: Query,
      findQuery: abhiprayQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllUserComplaintQueryDto) {
    return await this.abhipray.find(abhiprayQuery(Query));
  }

  async findOne(id: string) {
    return await this.abhipray.findById(id);
  }

  async update(updateUserComplaintDto: UpdateUserComplaintDto) {
    return await this.abhipray
      .findByIdAndUpdate(updateUserComplaintDto._id, updateUserComplaintDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.abhipray.findByIdAndDelete(id);
  }
}

const abhiprayQuery = ({ mobile, name }: UserComplaintQueryDto) => {
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
  return query;
};
