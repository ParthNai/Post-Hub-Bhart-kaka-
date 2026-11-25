import { Injectable } from '@nestjs/common';
import {
  AllServiceQueryDto,
  CreateServiceDto,
  ServiceQueryDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service } from './schema/service.schema';
import { Model, PipelineStage } from 'mongoose';
import { getAggregatePaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private service: Model<Service>) {}
  async create(createServiceDto: CreateServiceDto) {
    try {
      return await this.service.create(createServiceDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: ServiceQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.service,
      pageQuery: Query,
      findQuery: serviceQuery(Query),
      populate: [],
      pipeLines: servicePipeLine,
    });
  }

  async findAll(Query: AllServiceQueryDto) {
    return await this.service.find(serviceQuery(Query));
  }

  async findOne(id: string) {
    return await this.service.findById(id);
  }

  async update(updateServiceDto: UpdateServiceDto) {
    return await this.service
      .findByIdAndUpdate(updateServiceDto._id, updateServiceDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.service.findByIdAndDelete(id);
  }
}

const serviceQuery = ({ title }: ServiceQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }

  return query;
};

export const servicePipeLine: PipelineStage[] = [];
