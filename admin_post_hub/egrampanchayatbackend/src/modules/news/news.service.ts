import { Injectable } from '@nestjs/common';
import {
  AllNewsQueryDto,
  CreateNewsDto,
  NewsQueryDto,
  UpdateNewsDto,
} from './dto/news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schema/news.schema';
import { Model, PipelineStage } from 'mongoose';
import { getAggregatePaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private news: Model<News>) {}
  async create(createNewsDto: CreateNewsDto) {
    try {
      return await this.news.create(createNewsDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: NewsQueryDto) {
    return await getAggregatePaginatedResponse({
      model: this.news,
      pageQuery: Query,
      findQuery: newsQuery(Query),
      populate: [],
      pipeLines: newsPipeLine,
    });
  }

  async findAll(Query: AllNewsQueryDto) {
    return await this.news.find(newsQuery(Query));
  }

  async findOne(id: string) {
    return await this.news.findById(id);
  }

  async update(updateNewsDto: UpdateNewsDto) {
    return await this.news
      .findByIdAndUpdate(updateNewsDto._id, updateNewsDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.news.findByIdAndDelete(id);
  }
}

const newsQuery = ({ title }: NewsQueryDto) => {
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
