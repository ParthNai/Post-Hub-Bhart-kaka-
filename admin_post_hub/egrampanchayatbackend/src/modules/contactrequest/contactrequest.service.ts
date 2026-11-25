import { Injectable } from '@nestjs/common';
import {
  AllContactRequestQueryDto,
  CreateContactRequestDto,
  ContactRequestQueryDto,
  UpdateContactRequestDto,
} from './dto/contactrequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ContactRequest } from './schema/contactrequest.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class ContactRequestService {
  constructor(
    @InjectModel(ContactRequest.name)
    private abhipray: Model<ContactRequest>,
  ) {}
  async create(createContactRequestDto: CreateContactRequestDto) {
    try {
      return await this.abhipray.create(createContactRequestDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: ContactRequestQueryDto) {
    return await getPaginatedResponse({
      model: this.abhipray,
      pageQuery: Query,
      findQuery: abhiprayQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllContactRequestQueryDto) {
    return await this.abhipray.find(abhiprayQuery(Query));
  }

  async findOne(id: string) {
    return await this.abhipray.findById(id);
  }

  async update(updateContactRequestDto: UpdateContactRequestDto) {
    return await this.abhipray
      .findByIdAndUpdate(updateContactRequestDto._id, updateContactRequestDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.abhipray.findByIdAndDelete(id);
  }
}

const abhiprayQuery = ({ mobile, name }: ContactRequestQueryDto) => {
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
