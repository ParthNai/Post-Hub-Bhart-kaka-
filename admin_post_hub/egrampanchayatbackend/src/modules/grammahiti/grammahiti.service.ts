import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AllGramMahitiQueryDto,
  CreateGramMahitiDto,
  GramMahitiQueryDto,
  UpdateGramMahitiDto,
} from './dto/grammahiti.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GramMahiti } from './schema/grammahiti.schema';
import mongoose, { Model, PipelineStage } from 'mongoose';
import {
  getAggregatePaginatedResponse,
  getPaginatedResponse,
} from 'src/utils/getPaginatedResponse';
import { TableHeader } from '../tableheader/schema/tableheader.schema';
import { statusMatchQuery } from 'src/app-apis/app-apis.service';
import { createObjectId } from 'src/utils/string.utils';
import { TABLEHADERTYPES } from './enums/grammahiti.enum';

@Injectable()
export class GramMahitiService {
  constructor(
    @InjectModel(GramMahiti.name) private gramMahiti: Model<GramMahiti>,
    @InjectModel(TableHeader.name) private tableHeader: Model<TableHeader>,
  ) {}
  async create(createGramMahitiDto: CreateGramMahitiDto) {
    try {
      console.log('create field', createGramMahitiDto);
      // return await this.gramMahiti.create(createGramMahitiDto);

      const recordAddId = new mongoose.Types.ObjectId();
      Object.entries(createGramMahitiDto.extraFields).map(async ([k, v]) => {
        const findHeader = await this.tableHeader.findById(k);
        await this.gramMahiti.create({
          panchayatId: createGramMahitiDto.panchayatId,
          createdBy: createGramMahitiDto.createdBy,
          headerId: findHeader._id,
          isActive: true,
          sectionId: createGramMahitiDto.sectionId,
          type: findHeader.type,
          value: v,
          recordAddId,
          position: 0,
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: GramMahitiQueryDto) {
    const positionField = await this.tableHeader.findOne({
      name: 'ક્રમાંક',
      sectionId: Query.sectionId,
    });
    console.log('positionField', positionField);
    var sort = {};
    sort[positionField.id] = 1;
    const positionFieldId = positionField._id.toString();
    const pipelineStage: PipelineStage[] = [
      // {
      //   $group: {
      //     _id: {
      //       sectionId: '$sectionId',
      //       panchayatId: '$panchayatId',
      //     },
      //     data: { $push: '$$ROOT' },
      //   },
      // },

      // {
      //   $lookup: {
      //     from: 'grammahiti',
      //     localField: '_id',
      //     foreignField: 'headerId',
      //     as: 'headerData',
      //   },
      // },
      // { $sort: sort },
      // {
      //   $addFields: {
      //     numericValue: { $toInt: `$${positionField._id}` }, // or $toDouble
      //   },
      // },
      // {
      //   $sort: { numericValue: 1 }, // 1 = ascending, -1 = descending
      // },
      {
        $group: {
          _id: {
            recordAddId: '$recordAddId',
          },
          sectionId: { $first: '$sectionId' },
          headers: { $push: '$$ROOT' },
        },
      },
      // {
      //   $addFields: {
      //     newHeaders: {
      //       $reduce: {
      //         input: '$headers',
      //         initialValue: {},
      //         in: {
      //           $mergeObjects: ['$$value', '$$this'],
      //         },
      //       },
      //     },
      //   },
      // },

      // { $project: {} },
    ];
    const mahitiData = await getAggregatePaginatedResponse({
      model: this.gramMahiti,
      pageQuery: Query,
      findQuery: gramMahitiQuery(Query),
      populate: [],
      pipeLines: pipelineStage,
    });
    // console.log('mahitiData', mahitiData.data);

    return {
      ...mahitiData,
      data: mahitiData.data
        .map((e: any) => {
          return (e.headers as unknown as any).reduce((p, h) => {
            p[h.headerId] = h.value;
            p['_id'] = h.recordAddId;
            return p;
          }, {});
        })
        .sort((a, b) => {
          // return a[positionField._id] - b[positionField.id];
          return a[positionFieldId] - b[positionFieldId];
        }),
    };
  }

  async findAll(Query: AllGramMahitiQueryDto) {
    return await this.gramMahiti.find(gramMahitiQuery(Query));
  }

  async findOne(id: string) {
    return await this.gramMahiti.findById(id);
  }

  async update(updateGramMahitiDto: UpdateGramMahitiDto) {
    console.log('updateGramMahitiDto', updateGramMahitiDto);
    const recordAddId = updateGramMahitiDto._id;

    Object.entries(updateGramMahitiDto.extraFields).map(async ([k, v]) => {
      const findMahiti = await this.gramMahiti.findOne({
        recordAddId: updateGramMahitiDto._id,
        headerId: k,
      });

      if (findMahiti) {
        await this.gramMahiti.findByIdAndUpdate(findMahiti._id, {
          value: v,
        });
      } else {
        await this.gramMahiti.create({
          createdBy: 'auto',
          headerId: k,
          value: v,
          isActive: true,
          panchayatId: updateGramMahitiDto.panchayatId,

          recordAddId: recordAddId,
          sectionId: updateGramMahitiDto.sectionId,
          type: TABLEHADERTYPES.TEXT,
        });
      }
    });
  }

  async remove(id: string) {
    return await this.gramMahiti.deleteMany({ recordAddId: id });
  }

  async getTableHeaders(sectionId: string) {
    const data = await this.tableHeader.aggregate([
      ...statusMatchQuery,
      {
        $match: {
          sectionId: createObjectId(sectionId),
        },
      },
      {
        $addFields: {
          flex: 1,
          editable: false,
        },
      },
      {
        $project: {
          field: '$_id',
          headerName: '$name',
          type: { $toLower: '$type' },
          editable: '$editable',
          flex: 1,
          createdAt: 1,
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    return [
      ...data,
      // {
      //   _id: '68357fb97c0f7bb17b898bc8',
      //   createdAt: '2025-05-27T09:02:49.615Z',
      //   flex: 1,
      //   field: 'position',
      //   headerName: 'ક્રમાંક',
      //   type: 'text',
      //   editable: false,
      // },
    ];
  }
}

const gramMahitiQuery = ({
  panchayatId,
  headerId,
  sectionId,
}: GramMahitiQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: createObjectId(panchayatId),
    };
  }
  if (sectionId) {
    query = {
      ...query,

      sectionId: createObjectId(sectionId),
    };
  }
  if (headerId) {
    query = {
      ...query,

      headerId: headerId,
    };
  }

  return query;
};
