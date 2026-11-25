import { Injectable } from '@nestjs/common';
import {
  AllComplaintQueryDto,
  CreateComplaintDto,
  ComplaintQueryDto,
  UpdateComplaintDto,
} from './dto/complaints.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint } from './schema/complaints.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import { createObjectId } from 'src/utils/string.utils';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel(Complaint.name)
    private complaint: Model<Complaint>,
  ) {}
  async create(createComplaintDto: CreateComplaintDto) {
    try {
      return await this.complaint.create(createComplaintDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: ComplaintQueryDto) {
    return await getPaginatedResponse({
      model: this.complaint,
      pageQuery: Query,
      findQuery: complaintQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllComplaintQueryDto) {
    return await this.complaint.find(complaintQuery(Query));
  }

  async findOne(id: string) {
    return await this.complaint.findById(id);
  }

  async update(updateComplaintDto: UpdateComplaintDto) {
    return await this.complaint
      .findByIdAndUpdate(updateComplaintDto._id, updateComplaintDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.complaint.findByIdAndDelete(id);
  }
}

const complaintQuery = ({ mobile, name, panchayatId }: ComplaintQueryDto) => {
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
  if (panchayatId) {
    query = {
      ...query,

      panchayatId: createObjectId(panchayatId),
    };
  }
  return query;
};
