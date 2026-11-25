import { Injectable } from '@nestjs/common';
import {
  AllImportantLinkQueryDto,
  CreateImportantLinkDto,
  ImportantLinkQueryDto,
  UpdateImportantLinkDto,
} from './dto/importantlink.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ImportantLink } from './schema/importantlink.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class ImportantLinkService {
  constructor(
    @InjectModel(ImportantLink.name)
    private importantLink: Model<ImportantLink>,
  ) {}
  async create(createImportantLinkDto: CreateImportantLinkDto) {
    try {
      return await this.importantLink.create(createImportantLinkDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: ImportantLinkQueryDto) {
    return await getPaginatedResponse({
      model: this.importantLink,
      pageQuery: Query,
      findQuery: importantLinkQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllImportantLinkQueryDto) {
    return await this.importantLink.find(importantLinkQuery(Query));
  }

  async findOne(id: string) {
    return await this.importantLink.findById(id);
  }

  async update(updateImportantLinkDto: UpdateImportantLinkDto) {
    return await this.importantLink
      .findByIdAndUpdate(updateImportantLinkDto._id, updateImportantLinkDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.importantLink.findByIdAndDelete(id);
  }
}

const importantLinkQuery = ({ panchayatId }: ImportantLinkQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  }

  return query;
};
