import { Injectable } from '@nestjs/common';
import {
  AllAchievementQueryDto,
  CreateAchievementDto,
  AchievementQueryDto,
  UpdateAchievementDto,
} from './dto/achievement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Achievement } from './schema/achievement.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name) private achievement: Model<Achievement>,
  ) {}
  async create(createAchievementDto: CreateAchievementDto) {
    try {
      return await this.achievement.create(createAchievementDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: AchievementQueryDto) {
    return await getPaginatedResponse({
      model: this.achievement,
      pageQuery: Query,
      findQuery: achievementQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllAchievementQueryDto) {
    return await this.achievement.find(achievementQuery(Query));
  }

  async findOne(id: string) {
    return await this.achievement.findById(id);
  }

  async update(updateAchievementDto: UpdateAchievementDto) {
    return await this.achievement
      .findByIdAndUpdate(updateAchievementDto._id, updateAchievementDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.achievement.findByIdAndDelete(id);
  }
}

const achievementQuery = ({ panchayatId, title }: AchievementQueryDto) => {
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
  if (title) {
    query = {
      ...query,

      title: { $regex: title, $options: 'i' },
    };
  }
  return query;
};
