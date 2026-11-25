import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { NewsService } from './news.service';
import {
  AllNewsQueryDto,
  CreateNewsDto,
  NewsQueryDto,
  UpdateNewsDto,
} from './dto/news.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create({
      ...createNewsDto,
    });
  }

  @Get()
  find(@Query() query: NewsQueryDto) {
    console.log('query', query);
    return this.newsService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllNewsQueryDto) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch()
  update(@Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update({
      ...updateNewsDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.newsService.remove(id);
  }
}
