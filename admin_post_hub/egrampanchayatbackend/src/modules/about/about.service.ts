import { Injectable } from '@nestjs/common';
import {
  AllAboutQueryDto,
  CreateAboutDto,
  AboutQueryDto,
  UpdateAboutDto,
} from './dto/about.dto';
import { InjectModel } from '@nestjs/mongoose';
import { About } from './schema/about.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private about: Model<About>) {}
  async create(createAboutDto: CreateAboutDto) {
    try {
      return await this.about.create(createAboutDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(query: AboutQueryDto) {
    // return await getPaginatedResponse({
    //   model: this.about,
    //   pageQuery: Query,
    //   findQuery: aboutQuery(Query),
    //   populate: [],
    // });

    return await this.about.findOne(aboutQuery(query));
  }

  async findAll(Query: AllAboutQueryDto) {
    return await this.about.find(aboutQuery(Query));
  }

  async findOne(id: string) {
    return await this.about.findById(id);
  }

  async update(updateAboutDto: UpdateAboutDto) {
    return await this.about
      .findByIdAndUpdate(updateAboutDto._id, updateAboutDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.about.findByIdAndDelete(id);
  }
}

const aboutQuery = ({ title, panchayatId }: AboutQueryDto) => {
  let query = {};

  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  }
  return query;
};
