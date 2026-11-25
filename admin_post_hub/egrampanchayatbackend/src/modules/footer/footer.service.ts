import { Injectable } from '@nestjs/common';
import {
  AllFooterQueryDto,
  CreateFooterDto,
  FooterQueryDto,
  UpdateFooterDto,
} from './dto/footer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Footer } from './schema/footer.schema';
import { Model, PipelineStage } from 'mongoose';
import { getAggregatePaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class FooterService {
  constructor(@InjectModel(Footer.name) private footer: Model<Footer>) {}
  async create(createFooterDto: CreateFooterDto) {
    try {
      return await this.footer.create(createFooterDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: FooterQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.footer,
      pageQuery: Query,
      findQuery: footerQuery(Query),
      populate: [],
      pipeLines: footerPipeLine,
    });
  }

  async findAll(Query: AllFooterQueryDto) {
    return await this.footer.find(footerQuery(Query));
  }

  async findOne(id: string) {
    return await this.footer.findById(id);
  }

  async update(updateFooterDto: UpdateFooterDto) {
    return await this.footer
      .findByIdAndUpdate(updateFooterDto._id, updateFooterDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.footer.findByIdAndDelete(id);
  }
}

const footerQuery = ({ title }: FooterQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }

  return query;
};

export const footerPipeLine: PipelineStage[] = [];
