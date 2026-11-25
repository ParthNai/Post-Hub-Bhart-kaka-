import { Injectable } from '@nestjs/common';
import {
  AllFormQueryDto,
  CreateFormDto,
  FormQueryDto,
  UpdateFormDto,
} from './dto/form.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from './schema/form.schema';
import { Model, PipelineStage } from 'mongoose';
import { getAggregatePaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private news: Model<Form>) {}
  async create(createFormDto: CreateFormDto) {
    try {
      return await this.news.create(createFormDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: FormQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.news,
      pageQuery: Query,
      findQuery: newsQuery(Query),
      populate: [],
      pipeLines: newsPipeLine,
    });
  }

  async findAll(Query: AllFormQueryDto) {
    return await this.news.find(newsQuery(Query));
  }

  async findOne(id: string) {
    return await this.news.findById(id);
  }

  async update(updateFormDto: UpdateFormDto) {
    return await this.news
      .findByIdAndUpdate(updateFormDto._id, updateFormDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.news.findByIdAndDelete(id);
  }
}

const newsQuery = ({ title }: FormQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }

  return query;
};

export const newsPipeLine: PipelineStage[] = [];
