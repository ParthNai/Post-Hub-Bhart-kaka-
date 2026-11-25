import { Injectable } from '@nestjs/common';
import {
  AllTableSectionQueryDto,
  CreateTableSectionDto,
  TableSectionQueryDto,
  UpdateTableSectionDto,
} from './dto/tablesection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TableSection } from './schema/tablesection.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import { statusMatchQuery } from 'src/app-apis/app-apis.service';

@Injectable()
export class TableSectionService {
  constructor(
    @InjectModel(TableSection.name) private tableSection: Model<TableSection>,
  ) {}
  async create(createTableSectionDto: CreateTableSectionDto) {
    try {
      return await this.tableSection.create(createTableSectionDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: TableSectionQueryDto) {
    return await getPaginatedResponse({
      model: this.tableSection,
      pageQuery: Query,
      findQuery: tableSectionQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllTableSectionQueryDto) {
    return await this.tableSection.find(tableSectionQuery(Query));
  }

  async findOne(id: string) {
    return await this.tableSection.findById(id);
  }

  async update(updateTableSectionDto: UpdateTableSectionDto) {
    return await this.tableSection
      .findByIdAndUpdate(updateTableSectionDto._id, updateTableSectionDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.tableSection.findByIdAndDelete(id);
  }

  async panchayatSections() {
    return await this.tableSection.aggregate([...statusMatchQuery]);
  }
}

const tableSectionQuery = ({ panchayatId, title }: TableSectionQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  }
  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }
  return query;
};
