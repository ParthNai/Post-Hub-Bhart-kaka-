import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  AllTableHeaderQueryDto,
  CreateTableHeaderDto,
  TableHeaderQueryDto,
  UpdateTableHeaderDto,
} from './dto/tableheader.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TableHeader } from './schema/tableheader.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import { TABLEHADERTYPES } from './enums/tableheader.enum';
import { createObjectId } from 'src/utils/string.utils';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';
import { TableSection } from '../tablesection/schema/tablesection.schema';

@Injectable()
export class TableHeaderService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(TableHeader.name) private tableHeader: Model<TableHeader>,
    @InjectModel(Panchayat.name) private panchayat: Model<Panchayat>,
    @InjectModel(TableSection.name) private tableSection: Model<TableSection>,
  ) {}

  async onApplicationBootstrap() {
    const findSections = await this.tableSection.aggregate([
      {
        $project: {
          title: 1,
        },
      },
      // {
      //   $lookup: {
      //     from: 'tableheaders',
      //     let: { sectionId: '$_id' },
      //     pipeline: [
      //       { $match: { $expr: { $eq: ['$sectionId', '$$sectionId'] } } },
      //     ],
      //     as: 'headers',
      //   },
      // },
    ]);

    await Promise.all(
      findSections.map(async (sec) => {
        const findPositionHeader = await this.tableHeader.findOne({
          sectionId: sec._id,
          name: 'ક્રમાંક',
        });
        // console.log('findPostitionHeaders', findPositionHeader);
        if (!findPositionHeader) {
          const data = {
            name: 'ક્રમાંક',
            type: TABLEHADERTYPES.NUMBER,
            isActive: true,
            position: 99,
            sectionId: sec._id,
            createdBy: 'admin',
            isHidden: true,
          };

          await this.tableHeader.create(data);
        }
      }),
    );
    // console.log('sections', findSections[0].headers);
  }
  async create(createTableHeaderDto: CreateTableHeaderDto) {
    try {
      const data = await this.tableHeader.create(createTableHeaderDto);

      await this.findAndCreatePosionHeader(
        createTableHeaderDto.panchayatId,
        createTableHeaderDto.sectionId,
        createTableHeaderDto.createdBy,
      );

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAndCreatePosionHeader(
    panchayatId: string,
    sectionId: string,
    createdBy: string,
  ) {
    const findIfExist = await this.tableHeader.findOne({
      panchayatId,
      sectionId,
      name: 'ક્રમાંક',
    });
    if (findIfExist) {
      return;
    }
    const data = {
      name: 'ક્રમાંક',
      type: TABLEHADERTYPES.NUMBER,
      isActive: true,
      position: 1,
      sectionId: sectionId,
      createdBy: createdBy,
      isHidden: true,
    };

    await this.tableHeader.create(data);
  }

  async find(Query: TableHeaderQueryDto) {
    return await getPaginatedResponse({
      model: this.tableHeader,
      pageQuery: Query,
      findQuery: tableHeaderQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllTableHeaderQueryDto) {
    return await this.tableHeader.find(tableHeaderQuery(Query));
  }

  async findOne(id: string) {
    return await this.tableHeader.findById(id);
  }

  async update(updateTableHeaderDto: UpdateTableHeaderDto) {
    return await this.tableHeader
      .findByIdAndUpdate(updateTableHeaderDto._id, updateTableHeaderDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.tableHeader.findByIdAndDelete(id);
  }
}

const tableHeaderQuery = ({
  panchayatId,
  name,
  sectionId,
}: TableHeaderQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  }
  if (sectionId) {
    query = {
      ...query,

      sectionId: sectionId,
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
