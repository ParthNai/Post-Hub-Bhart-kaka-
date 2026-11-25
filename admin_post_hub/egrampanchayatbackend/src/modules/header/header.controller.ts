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
import { HeaderService } from './header.service';
import {
  AllHeaderQueryDto,
  CreateHeaderDto,
  HeaderQueryDto,
  UpdateHeaderDto,
} from './dto/header.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('header')
@Controller('header')
export class HeaderController {
  constructor(private readonly headerService: HeaderService) {}

  @Post()
  create(@Body() createHeaderDto: CreateHeaderDto) {
    return this.headerService.create({
      ...createHeaderDto,
    });
  }

  @Get()
  find(@Query() query: HeaderQueryDto) {
    console.log('query', query);
    return this.headerService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllHeaderQueryDto) {
    return this.headerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.headerService.findOne(id);
  }

  @Patch()
  update(@Body() updateHeaderDto: UpdateHeaderDto) {
    return this.headerService.update({
      ...updateHeaderDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.headerService.remove(id);
  }
}
