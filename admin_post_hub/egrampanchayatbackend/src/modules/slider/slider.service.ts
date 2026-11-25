import { Injectable } from '@nestjs/common';
import {
  AllSliderQueryDto,
  CreateSliderDto,
  SliderQueryDto,
  UpdateSliderDto,
} from './dto/slider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Slider } from './schema/slider.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class SliderService {
  constructor(@InjectModel(Slider.name) private slider: Model<Slider>) {}
  async create(createSliderDto: CreateSliderDto) {
    try {
      return await this.slider.create(createSliderDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: SliderQueryDto) {
    return await getPaginatedResponse({
      model: this.slider,
      pageQuery: Query,
      findQuery: sliderQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllSliderQueryDto) {
    return await this.slider.find(sliderQuery(Query));
  }

  async findOne(id: string) {
    return await this.slider.findById(id);
  }

  async update(updateSliderDto: UpdateSliderDto) {
    return await this.slider
      .findByIdAndUpdate(updateSliderDto._id, updateSliderDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.slider.findByIdAndDelete(id);
  }
}

const sliderQuery = ({ panchayatId }: SliderQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
    };
  } else {
    query = {
      ...query,

      panchayatId: { $exists: false },
    };
  }

  return query;
};
