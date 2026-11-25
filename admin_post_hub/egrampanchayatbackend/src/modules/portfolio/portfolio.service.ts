import { Injectable } from '@nestjs/common';
import {
  AllPortfolioQueryDto,
  CreatePortfolioDto,
  PortfolioQueryDto,
  UpdatePortfolioDto,
} from './dto/portfolio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './schema/portfolio.schema';
import { Model } from 'mongoose';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolio: Model<Portfolio>,
  ) {}
  async create(createPortfolioDto: CreatePortfolioDto) {
    try {
      return await this.portfolio.create(createPortfolioDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find(Query: PortfolioQueryDto) {
    return await getPaginatedResponse({
      model: this.portfolio,
      pageQuery: Query,
      findQuery: portfolioQuery(Query),
      populate: [],
    });
  }

  async findAll(Query: AllPortfolioQueryDto) {
    return await this.portfolio.find(portfolioQuery(Query));
  }

  async findOne(id: string) {
    return await this.portfolio.findById(id);
  }

  async update(updatePortfolioDto: UpdatePortfolioDto) {
    return await this.portfolio
      .findByIdAndUpdate(updatePortfolioDto._id, updatePortfolioDto)
      .setOptions({ new: true });
  }

  async remove(id: string) {
    return await this.portfolio.findByIdAndDelete(id);
  }
}

const portfolioQuery = ({ panchayatId, name }: PortfolioQueryDto) => {
  let query = {};

  if (panchayatId) {
    query = {
      ...query,

      panchayatId: panchayatId,
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
